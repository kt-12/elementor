export class CheckLCPImageBeforeSave extends $e.modules.hookData.Dependency {
	getCommand() {
        return 'document/save/save';
    }

    getId() {
        return 'check-lcp-image-before-save';
    }

    getConditions( args ) {
        return 'publish' === args.status && ! args.force; // Don't check if it's a forced save.
    }

   async apply() {
        const currentDeviceMode = this.getCurrentDeviceMode(),
        currentScrollPosition = this.getPreviewFrame().scrollY;

        // Switch to desktop mode to get the LCP image.
        const deviceMode = 'desktop'
        this.switchDeviceMode( deviceMode, currentDeviceMode );
        let webVitals = await this.getWebVitalsFromPreview( deviceMode );
        let lcpImages = webVitals.lcp.entries.filter( entry => entry.nodeName === 'IMG' );

        if( lcpImages.length ) {
            const imgElements = this.getImageElementsList( elementor.getPreviewContainer().children );
            this.setLoadingOptimizationSettings( imgElements, lcpImages );
        }

        this.switchDeviceMode( currentDeviceMode );
        this.getPreviewFrame().scrollTo( 0, currentScrollPosition );

        return true;
    }

    switchDeviceMode( newDeviceMode, currentDeviceMode = null ) {
        if ( ! currentDeviceMode ) {
            currentDeviceMode = this.getCurrentDeviceMode();
        }

        if( currentDeviceMode !== newDeviceMode ) {
            $e.run( 'panel/change-device-mode', { device: newDeviceMode } );
        }
    }

    async getWebVitalsFromPreview( device ) {
        return await new Promise( (resolve, reject) => {
            // Listen for message from preview frame.
            let eventRef = window.addEventListener("message", (event) => {
                if (event.data?.name && event.data?.name == 'elementor/web-vitals/editor') {
                    window.removeEventListener("message", eventRef);
                    resolve(event.data);
                }
            });
            
            // Send message to preview frame to request web vitals.
            this.getPreviewFrame().postMessage(
                { 
                    device,
                    name: 'elementor/web-vitals/preview',
                },
                '*',
            );
        });
    }

    getImageElementsList( elements ) {
        let flatted = [];
        for ( const element of elements ) {
            if( element?.label === 'Image' ){
                flatted.push( element );
            }
            if ( element.children.length ) {
                flatted = flatted.concat( this.getImageElementsList( element.children ) );
            }
        }
        return flatted;
    }

    setLoadingOptimizationSettings( elements, lcpImages ) {
        elements.forEach( ( element ) => {
            // Use the internal command because it's not a user action
            $e.internal( 'document/elements/set-settings', {
                container: element,
                settings: {
                    is_lcp_image: this.isLCPImage( element, lcpImages ), // Todo: if `false` then remove the setting
                    is_above_the_fold: this.isElementAboveTheFold( element ),
                },
                options: {
                    external: true, // Update panel if it's open
                    render: false, // Don't re-render the element
                },
            } );
        } );
    }

    isLCPImage( element, lcpImages ) { 
        for ( const lcpImage of lcpImages ) {
            if( lcpImage.widgetId === element.id ) {
                return true;
            }
        }
        return false;
    }

    isElementAboveTheFold( element ) {
        if ( ! element.view.el.offsetParent ) {
            return false;
        }
        const elementRect = element.view.el.getBoundingClientRect();
        return elementRect.top < window.innerHeight;
    }

    /**
	 * Check if the current script context is the Editor.
	 *
	 * @return {boolean}
	 */
	isInEditor() {
		return !! window.elementor;
	}

	/**
	 * Get the Preview Frame.
	 *
	 * @return {Window}
	 */
	getPreviewFrame() {
		return this.isInEditor()
			? elementor.$preview[ 0 ].contentWindow
			: window;
	}

    getCurrentDeviceMode() {
        return elementor.channels.deviceMode.request( 'currentMode' );
    }
}

export default CheckLCPImageBeforeSave;
