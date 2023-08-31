import HookDataAfter from 'elementor-api/modules/hooks/data/after';
// import * as WebVitals from 'web-vitals';

export class CheckLCPImageBeforeSave extends HookDataAfter {
	getCommand() {
        return 'document/save/save';
    }

    getId() {
        return 'check-lcp-image-before-save';
    }

    apply( args, result ) {
        console.log("Test", args, result);
        console.log(elementor.getPreviewContainer().children);
        const restoreEditorState = this.switchToDesktopTop();
        // console.log(WebVitals);
        // restoreEditorState()
    }

    switchToDesktopTop() {
        const currentDeviceMode = elementor.channels.deviceMode.request( 'currentMode' ),
            iframeWindow = elementor.$preview[ 0 ].contentWindow,
            currentScrollPosition = iframeWindow.scrollY;

        $e.run( 'panel/change-device-mode', { device: 'desktop' } );
        iframeWindow.scrollTo( 0, 0 );

        return () => {
            $e.run( 'panel/change-device-mode', { device: currentDeviceMode } );
            iframeWindow.scrollTo( 0, currentScrollPosition );
        };
    }
}

export default CheckLCPImageBeforeSave;
