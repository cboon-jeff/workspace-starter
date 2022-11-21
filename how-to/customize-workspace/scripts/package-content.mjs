import FastGlob from 'fast-glob';
import * as fs from 'fs/promises';
import path from 'path';

// example command
// npm run package-content --env=uat --host=https://openfin.mydomain.com

(async () => {
	const env = process.env.npm_config_env ?? 'local';
	const host = process.env.npm_config_host ?? 'http://localhost:8181';

	console.log('Package');
	console.log('=======');
	console.log();
	console.log('Env:', env);
	console.log('Host:', host);
	console.log();

	try {
		const packagedDir = await packageContent(env, host);

		if (host.includes('localhost')) {
			console.log();
			console.log('Execute the following command to serve locally');
			const url = new URL(host);
			console.log(`   npx http-server ${path.relative('.', packagedDir)} -p ${url.port}`);
			console.log(`and start the app with`);
			console.log(`   start fin://${url.host}/manifest.fin.json`);
		}
	} catch (err) {
		console.error(err);
	}
})();

async function packageContent(env, host) {
	const packageConfig = await readJsonFile('./scripts/package-config.json');

	const packagedDirectory = path.join(import.meta.url, '..', '..', 'packaged', env).replace('file:\\', '');
	console.log('Packaged Directory', packagedDirectory);
	console.log();

	try {
		await fs.rm(packagedDirectory, { recursive: true, force: true });
	} catch {}

	await fs.mkdir(packagedDirectory, { recursive: true });

	const cache = {};

	// Copy the list of content packs from the content
	for (const contentPack of packageConfig.contentPacks) {
		console.log('Copying content pack', contentPack.id);
		console.log();

		const fullSourceDir = path.resolve(contentPack.sourceRoot).replace(/\\/g, '/');

		for (const source of contentPack.sources) {
			const fullSource = path.join(contentPack.sourceRoot, source);

			const expandedGlob = await FastGlob(path.resolve(fullSource).replace(/\\/g, '/'));

			if (expandedGlob.length === 0) {
				console.warn(`WARNING: The source '${source}' has no content`);
			}

			for (const expandedSrc of expandedGlob) {
				const outFile = path.join(
					packagedDirectory,
					contentPack.dest,
					path.relative(fullSourceDir, expandedSrc)
				);

				// Copy the expanded globs from the content packs
				// this will in turn find any dependencies within
				// the file and copy those as well
				await copyFileWithReplace(
					packageConfig,
					env,
					path.relative('.', expandedSrc),
					outFile,
					packagedDirectory,
					host,
					cache
				);
			}
		}
	}

	console.log();
	console.log('Updating manifest-hosts.json');

	const hostUrl = new URL(host);

	const hostsFilename = path.join(packagedDirectory, 'manifest-hosts.json');
	let manifestHosts = await readJsonFile(hostsFilename);
	manifestHosts = manifestHosts.filter((h) => h !== 'localhost' && h !== '127.0.0.1');
	manifestHosts.push(hostUrl.hostname);
	await fs.writeFile(hostsFilename, JSON.stringify(manifestHosts, undefined, '\t'));

	return packagedDirectory;
}

async function copyFileWithReplace(packageConfig, env, src, dest, packagedDirectory, host, cache) {
	if (!cache[src]) {
		cache[src] = dest;

		console.log('Copying', src);
		console.log('To', path.relative('.', dest));
		console.log();

		try {
			await fs.mkdir(path.dirname(dest), { recursive: true });
		} catch {}

		const ext = path.extname(src);
		if (packageConfig.replaceTypes.includes(ext)) {
			// This file needs further processing
			let data = await fs.readFile(src, 'utf8');

			// replace any host references
			data = data.replace(new RegExp(packageConfig.manifestHost, 'g'), host);

			// and any tokens
			if (packageConfig?.tokens?.[env]) {
				for (const token in packageConfig.tokens[env]) {
					data = data.replace(new RegExp(`{OF-${token}}`, 'g'), packageConfig.tokens[env][token]);
				}
			}

			await fs.writeFile(dest, data);

			// now perform a recursive lookup to make sure any dependencies
			// it references are also update and included in the package
			await locateAssets(packageConfig, env, src, data, packagedDirectory, host, cache);
		} else {
			// Not a file to process so just copy it
			await fs.copyFile(src, dest);
		}
	}
}

async function locateAssets(packageConfig, env, src, fileContent, packagedDirectory, host, cache) {
	// Find all entries that contain the host name
	const reHost = new RegExp(`${host}(.*)"`, 'g');

	let match = fileContent.match(reHost);
	if (match) {
		match = [...new Set(match)];

		for (const m of match) {
			const p = new RegExp(`${host}(.*)"`, 'g').exec(m);

			if (p?.length === 2 && p[1].length > 0) {
				await copyAsset(packageConfig, env, p[1], packagedDirectory, host, cache);
			}
		}
	}

	// Now find any src or href links
	const reLink = new RegExp(/(?:src|href)="([./].*?)"/g);
	match = fileContent.match(reLink);
	if (match) {
		match = [...new Set(match)];

		for (const m of match) {
			const p = new RegExp(/(?:src|href)="([./].*?)"/g).exec(m);

			if (p?.length === 2 && p[1].length > 0) {
				const publicPack = packageConfig.contentPacks.find((pack) => pack.id === 'public');
				const fullSrc =
					p[1].startsWith('/') && publicPack
						? path.join(publicPack.sourceRoot, p[1].slice(1))
						: path.join(path.relative('.', path.dirname(src)), p[1]);
				await copyAsset(packageConfig, env, fullSrc, packagedDirectory, host, cache);
			}
		}
	}

	// Any import from
	const reImport = new RegExp(/import.*from '(.*)'/g);
	match = fileContent.match(reImport);
	if (match) {
		match = [...new Set(match)];

		for (const m of match) {
			const p = new RegExp(/import.*from '(.*)'/g).exec(m);

			if (p?.length === 2 && p[1].length > 0) {
				const fullSrc = path.join(path.relative('.', path.dirname(src)), p[1]);
				await copyAsset(packageConfig, env, fullSrc, packagedDirectory, host, cache);
			}
		}
	}
}

async function copyAsset(packageConfig, env, url, packagedDirectory, host, cache) {
	let srcName;
	let destName;
	url = url.replace(/\\/g, '/');

	const commonPack = packageConfig.contentPacks.find((p) => p.id === 'common');
	if (commonPack && (url.startsWith(commonPack.sourceRoot) || url.startsWith('/common/'))) {
		// If the content is referenced through the common part of the url
		// replace it with the details for the common asset pack
		const file = url.replace(commonPack.sourceRoot, '').replace(/^\/common\//, '');
		srcName = path.join(commonPack.sourceRoot, file);
		destName = path.join(packagedDirectory, commonPack.dest, file);
	} else {
		// No common reference in the content, so just use the public pack
		const publicPack = packageConfig.contentPacks.find((p) => p.id === 'public');
		if (publicPack) {
			// remove any /public/ from the start of the file
			const file = url.replace(/^\/?public\//, '');
			srcName = path.join(publicPack.sourceRoot, file);
			destName = path.join(packagedDirectory, publicPack.dest, file);
		}
	}

	if (srcName && destName) {
		await copyFileWithReplace(packageConfig, env, srcName, destName, packagedDirectory, host, cache);
	}
}

async function readJsonFile(filename) {
	try {
		const content = await fs.readFile(filename, 'utf8');
		return JSON.parse(content);
	} catch (err) {
		console.error(`Error reading ${filename}`, err);
	}
}
