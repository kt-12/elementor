import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../../pages/wp-admin-page';
import { afterAll, beforeAll } from './helper';

test.describe( 'Rating widget @rating', () => {
	test.describe( 'Rating experiment inactive', () => {
		test.beforeAll( async ( { browser }, testInfo ) => {
			const page = await browser.newPage();
			const wpAdmin = await new WpAdminPage( page, testInfo );

			await wpAdmin.setExperiments( {
				rating: 'inactive',
				container: 'active',
			} );

			await page.close();
		} );

		test.afterAll( async ( { browser }, testInfo ) => {
			const context = await browser.newContext();
			const page = await context.newPage();
			const wpAdmin = new WpAdminPage( page, testInfo );
			await wpAdmin.setExperiments( {
				rating: 'inactive',
				container: 'inactive',
			} );

			await page.close();
		} );

		test( 'Rating widget should not appear in widgets panel', async ( { page }, testInfo ) => {
			// Arrange
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.openNewPage(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				frame = editor.getPreviewFrame(),
				starRatingWrapper = await frame.locator( '.elementor-star-rating' ).first();

			await test.step( 'Check that Toggle and Accordion widgets appear when nested accordion experiment is off', async () => {
				// Act
				await editor.addWidget( 'star-rating', container );

				// Assert
				await expect.soft( await starRatingWrapper ).toHaveCount( 1 );
			} );
		} );
	} );

	test.describe( 'Rating experiment is active', () => {
		test.beforeAll( async ( { browser }, testInfo ) => {
			await beforeAll( browser, testInfo );
		} );

		test.afterAll( async ( { browser }, testInfo ) => {
			await afterAll( browser, testInfo );
		} );

		test( 'Widget panel test', async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.openNewPage(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				starRatingWidgetInPanel = await page.locator( 'i.eicon-rating' ).first(),
				widgetPanelButton = await page.locator( '#elementor-panel-header-add-button .eicon-apps' ),
				widgetSearchBar = '#elementor-panel-elements-search-wrapper input#elementor-panel-elements-search-input';

			let ratingID,
				rating;

			await test.step( 'Check that Star Rating widget does not appear when rating experiment is on', async () => {
				// Act
				await editor.closeNavigatorIfOpen();
				widgetPanelButton.click();

				await page.waitForSelector( widgetSearchBar );
				await page.locator( widgetSearchBar ).fill( 'star-rating' );

				// Assert
				await expect.soft( starRatingWidgetInPanel ).toBeHidden();
			} );

			await test.step( 'Check that Rating widget is active', async () => {
				// Act
				ratingID = await editor.addWidget( 'rating', container );
				rating = await editor.selectElement( ratingID );

				// Assert
				await expect.soft( await rating ).toHaveCount( 1 );
			} );
		} );
	} );
} );
