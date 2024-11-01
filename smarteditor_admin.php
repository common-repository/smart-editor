<?php
/**
 * Smart Editor
 *
 * @package Smart Editor
 * @author Wada Minoru
 **/

class SMART_EDITOR_Admin {

	function __construct() {
		// Edit Form
		$this->add_action( 'edit_page_form', 'edit_page_form' );
		$this->add_action( 'load-post.php', 'edit_page_form' );
		$this->add_action( 'load-post-new.php', 'edit_page_form' );
		
		// ShortLink
		$this->add_filter( 'post_row_actions', 'addSmartEditorLink',10,2);
		$this->add_filter( 'page_row_actions', 'addSmartEditorLink',10,2);
	}

	function add_action($action, $function = '', $priority = 10, $accepted_args = 1) {
		add_action($action, array(&$this, $function == '' ? $action : $function), $priority, $accepted_args);
	}

	function add_filter($filter, $function = '', $priority = 10, $accepted_args = 1) {
		add_filter($filter, array(&$this, $function == '' ? $filter : $function), $priority, $accepted_args);
	}
	function edit_page_form(){
		$this->add_action('admin_footer', 'add_edit_page_form');
	}
	function add_edit_page_form(){
		global $post;
		$url = get_permalink( $post->ID ).'?preview=true&editor=true';
		?>
		<script type="text/javascript">
			var href = "";
			var element = document.createElement('a');
			element.id = "content-smarteditor";
			element.innerHTML = "Smart Editor";
			element.href = "<?php echo $url; ?>";
			element.className = "wp-switch-editor switch-smarteditor";
			var WP_ContentEditorTool = document.getElementById('wp-content-editor-tools');
			WP_ContentEditorTool.insertBefore(element,WP_ContentEditorTool.firstChild);
			
			element.addEventListener('click',function(e){
				if(document.getElementById('sample-permalink')){
					//GO GO!
				}
				else {
					e.preventDefault();
					alert("<?php _e('Please enter a site title.'); ?>");
				}
			});
			
		</script>
		<?php
	}
	function addSmartEditorLink($actions ,$post){
		$actions['smarteditor'] = '<a href="'.get_permalink( $post->ID ).'?preview=true&editor=true'.'">Smart Editor</a>';
		return $actions;
	}
	
}


