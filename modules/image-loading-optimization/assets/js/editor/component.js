
import * as hooks from './hooks';

export default class Component extends $e.modules.ComponentBase {
	getNamespace() {
		return 'image-loading-optimization';
	}

	defaultHooks() {
		return this.importHooks( hooks );
	}
}
