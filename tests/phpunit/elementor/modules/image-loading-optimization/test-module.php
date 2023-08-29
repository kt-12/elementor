<?php
namespace Elementor\Tests\Phpunit\Elementor\Modules\Image_Loading_Optimization;

use Elementor\Core\Base\Document;
use Elementor\Modules\PageTemplates\Module as PageTemplatesModule;
use Elementor\Plugin;
use ElementorEditorTesting\Elementor_Test_Base;
use Elementor\TemplateLibrary\Source_Local;

class Elementor_Image_Loading_Optimization_Test_Module extends Elementor_Test_Base {

	/**
	 * @dataProvider get_page_template
	 */
	public function test_loading_optimization_without_logo( $page_template ) {

		print_r( $page_template );

		$document = self::factory()->create_post();
		$content = '<img width="800" height="530" src="featured_image.jpg" /><img width="640" height="471" src="image_1.jpg" /><img width="800" height="800" src="image_2.jpg" /><img width="566" height="541" src="image_3.jpg" /><img width="691" height="1024" src="image_4.jpg" />';

		// Update the post content.
		$updated_post = array( 'ID' => $document->get_id(), 'post_content' => $content );
		wp_update_post( $updated_post );
		$page_templates_module = Plugin::$instance->modules_manager->get_modules( 'page-templates' );
		$document->update_main_meta( '_wp_page_template', $page_template );
		
		query_posts( [ 'p' => $document->get_id() ] );
		$template_path = locate_template('single.php');
		$template_path = $page_templates_module->template_include( $template_path );
		print_r($template_path);

		ob_start();
		load_template($template_path);
		$output = ob_get_clean();

		$expected = '<p><img fetchpriority="high" decoding="async" width="800" height="530" src="featured_image.jpg" /><img decoding="async" width="640" height="471" src="image_1.jpg" /><img decoding="async" width="800" height="800" src="image_2.jpg" /><img loading="lazy" decoding="async" width="566" height="541" src="image_3.jpg" /><img loading="lazy" decoding="async" width="691" height="1024" src="image_4.jpg" /></p>';
		$this->assertStringContainsString( $expected, $output, "Loading optimization not applied to the content");
	}

	public function get_page_template() {
		$page_templates_module = Plugin::$instance->modules_manager->get_modules( 'page-templates' );
		return [
			[ $page_templates_module::TEMPLATE_CANVAS ],
			// [ $page_templates_module::TEMPLATE_HEADER_FOOTER ],
			// [ $page_templates_module::TEMPLATE_THEME ]
		];
	}
}


