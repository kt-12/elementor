import Component from './component';

export default class ImageLoadingOptimizationModule extends elementorModules.editor.utils.Module {
	onInit() {
		$e.components.register( new Component() );
	}
}
