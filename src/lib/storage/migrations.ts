import {inject, injectable} from 'inversify';
import {IStorageDriver, Storage} from './storage';

@injectable()
export abstract class Migrations {

	constructor(@inject(Storage) protected storage: IStorageDriver){}

	abstract getVersion(): number;

	abstract onUpgrade(toVersion: number);

	async upgrade() {
		let version = await this.readVersion();
		while (version < this.getVersion()) {
			console.log(`Upgrading from ${version} to ${version + 1}`);
			version++;
			const label = `Successfully upgraded to ${version}`;
			console.time(label);
			await this.onUpgrade(version);
			await this.writeVersion(version);
			console.timeEnd(label);
		}
	}

	async readVersion(): Promise<number> {
		const parts = this.getVersionDocumentPathParts();
		const snapshot = await this.storage.findById(parts.collection, parts.document);
		if (snapshot) {
			return snapshot.version || 0;
		}
		return 0;
	}

	async writeVersion(version: number) {
		const parts = this.getVersionDocumentPathParts();
		await this.storage.save(parts.collection, {
			id: parts.document,
			version: version
		});
	}

	// noinspection JSMethodCanBeStatic
	protected getVersionDocumentPath() {
		return 'version/current'
	}

	private getVersionDocumentPathParts() {
		const path = this.getVersionDocumentPath();
		const parts = path.split('/');
		if (parts.length !== 2) {
			throw new Error('Invalid version document path. Use format collection/docId. For example version/current');
		}
		return {
			collection: parts[0],
			document: parts[1]
		}
	}
}
