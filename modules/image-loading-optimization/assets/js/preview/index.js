import { onLCP } from './web-vitals';

class WebVitalsChecker extends elementorModules.ViewModule {
    lcp = null;
    
    /**
     * Initialize the Preview module.
     *
     * @return {void}
     */
     onInit() {
        super.onInit();
        this.editorMessageListener();
        onLCP(this.captureLCP.bind(this));
    }

    /**
     * Listen to messages from the Editor.
     * 
     * @return {void}
     */
    editorMessageListener() {
        window.addEventListener( 'message', ( event ) => {
            if (event.data?.name && event.data?.name == 'elementor/web-vitals/preview') {
                this.sendWebVitalsToEditor( event.data?.device );
            }
        } );
    }

    /**
     * Send the LCP data to the Editor.
     *
     * @param {string} device
     * @return {void}
     */
    sendWebVitalsToEditor( device ) {
        window.parent.postMessage({
            name: 'elementor/web-vitals/editor',            
            device: device, 
            lcp: this.lcp
        }, '*');
    }

    /**
     * Capture LCP data.
     * 
     * @param {object} report
     * @return {void}
     */
    captureLCP( report ) {
        let entries = report.entries.map((entry) => {
            const { element, url } = entry;
            const widget = this.getParentWidget( element );
            return {
                url,
                id: element?.id,
                className: element?.className,
                nodeName: element?.nodeName,
                width: element?.clientWidth,
                height: element?.clientHeight,
                widgetId: widget?.getAttribute('data-id'),
            };
        });
        report.entries = entries;
        this.lcp = report;
    }

    /**
     * Get parent widget element of an element.
     *
     * @param {string} device
     * @return {object} widget element
     */
    getParentWidget( element ) {
        while (element) {
            if (element.getAttribute && element.getAttribute("data-element_type") === "widget") {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }
}

document.addEventListener( 'DOMContentLoaded', () => new WebVitalsChecker() );
