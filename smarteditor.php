<?php
/*
Plugin Name: Smart Editor
Plugin URI: http://www.coffee-break-designs.com/plugin/word-press/smart-editor/
Description: プレビュー画面で編集できます。
Author: Wada Minoru
Version: 0.8.2
Author URI: http://www.coffee-break-designs.com/
License: GPL2

Copyright 2013 Wada Minoru(email : wada@coffee-break-designs.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 */
load_plugin_textdomain('smarteditor', false, basename( dirname( __FILE__ ) ) . '/languages' );

include dirname(__FILE__) . '/smarteditor_admin.php';
include dirname(__FILE__) . '/smarteditor_option_screen.php';
include dirname(__FILE__) . '/smarteditor_tool.php';
class WYSIPREVIEW {
	private $smarteditor_admin;
	private $tool;
	private $option;
	private $VERSION = "0.8.2";

	function __construct() {
		$this -> add_action('wp', 'approve_post');
		$this -> add_action('admin_menu', 'admin_menu');
		
		$this -> add_action('the_content', 'addSmartEditor',2);
		//$this -> add_action('admin_bar_menu', 'add_bar_item',9999);
		$this -> add_action('wp_print_footer_scripts','footer_scripts');
		//$this -> add_filter('the_title', 'wraptitle');
	}

	function add_action($action, $function = '', $priority = 10, $accepted_args = 1) {
		add_action($action, array(&$this, $function == '' ? $action : $function), $priority, $accepted_args);
	}

	function add_filter($filter, $function = '', $priority = 10, $accepted_args = 1) {
		add_filter($filter, array(&$this, $function == '' ? $filter : $function), $priority, $accepted_args);
	}
	function admin_menu(){
		$smarteditor_admin = new SMART_EDITOR_Admin;
		add_options_page ('SmartEditor_Option', 'SmartEditor', 'manage_options', basename (__FILE__), array ($this, 'option_screen'));
	}
	function option_screen(){
		$option = new SMART_EDITOR_OPTION_SCREEN($this->VERSION);
	}
	
	function testfun(){
		global $post;
		echo "<div style='position:fixed;width:300px;height:300px;background:#FFF;left:0px;top:30px;'>";
		echo "is_page:".is_page()."<br />";
		echo "is_preview:".is_preview()."<br />";
		echo "is_single:".is_single()."<br />";
		echo "is_singular:".is_singular()."<br />";
		echo "is_user_logged_in:".is_user_logged_in()."<br />";
		echo "ID:".$post->ID."<br />";
		echo "b:".is_singular('post').is_singular('page')."<br />";
		echo "post:".get_post($post->ID)->post_type."<br />";
		echo "is_page:".is_page($post->ID)."<br />";
		echo "is_archive:".is_archive($post->ID)."<br />";
		echo "is_single:".is_single($post->ID)."<br />";
		echo "</div>";
	}
	
	// PREVIEW -------------------------------------------------
	function addSmartEditor($content) {
		//$this -> add_action('wp_before_admin_bar_render', 'add_bar_item',9999); // not admin page
		$this -> add_action('admin_bar_menu', 'add_bar_item',9999); // content only
		global $post;
		if ($this->is_view()) {
			wp_enqueue_style('smarteditor', plugin_dir_url(__FILE__) . 'css/smarteditor.css');
			wp_enqueue_script('jquery');
			//  - - - Smart Editor Unit
			// options
			$this->echo_options();
			// scripts
			wp_enqueue_script('smarteditor-utilty', plugin_dir_url(__FILE__) . 'js/smarteditor-utilty.js',array(),$this->VERSION,TRUE);
			wp_enqueue_script('smarteditor-window', plugin_dir_url(__FILE__) . 'js/smarteditor-window.js',array(),$this->VERSION,TRUE);
			wp_enqueue_script('smarteditor-element-editor', plugin_dir_url(__FILE__) . 'js/smarteditor-element-editor.js',array(),$this->VERSION,TRUE);
			wp_enqueue_script('smarteditor-source-editor', plugin_dir_url(__FILE__) . 'js/smarteditor-source-editor.js',array(),$this->VERSION,TRUE);
			wp_enqueue_script('smarteditor-main', plugin_dir_url(__FILE__) . 'js/smarteditor.js',array(),$this->VERSION,TRUE);
			
			wp_enqueue_media();
			//$content = '<div id="SmartEditor" contenteditable="false">'.$content.'</div>';
			$content = '<div id="SmartEditor" contenteditable="false">'.$post->post_content.'</div>';
		}
		
		return $content;
	}
	/*
	function wraptitle($title){
		global $post;
		if ($this->is_view() && $title == $post->post_title) {
			$title = '<span id="WYSIPREVIEW_TITLE" contenteditable="false">'.$title.'</span>';
		}
		return $title;
	}
	 */
	
	function echo_options(){
		$opt = get_option('smart_editor_options');
		$classNames = isset($opt['classNames']) ? $opt['classNames']: null;
		printf("<script type='text/javascript'>var smart_editor_options_classnames = '%s'</script>",$classNames);
	}
	
	function is_view(){
		global $post;
		if (current_user_can('edit_post', $post->ID)
			&& isset($_REQUEST['editor'])
			){ /**/
		/*if (
			is_preview() 
			&& (is_single() || is_singular()) 
			&& current_user_can('edit_post', $post->ID) 
			&& isset($_REQUEST['editor'])
			){ /**/
				return TRUE;
		}
		else {
			return FALSE;
		}
	}

	function footer_scripts(){
		if ($this->is_view()) {
			$tool = new SMART_EDITOR_tool($this->VERSION);
		}
	}
	function add_bar_item($wp_admin_bar){
		global $post;
		if(get_permalink( $post->ID ) != ""){
			$url = get_permalink( $post->ID ).'?preview=true&editor=true';
			$wp_admin_bar->add_menu( array(
				'id'=>'smarteditor',
				'title'=>'Smart Editor',
				'href'=>$url
			));
		}
	}

	function approve_post() {
		if (!isset($_REQUEST['_wpnonce']) ||
				!isset($_REQUEST['pid']) || 
				!isset($_REQUEST['action']) || 
				$_REQUEST['action'] != "AFP" || 
				!isset($_REQUEST['SMART_EDITOR_POST_VALUE'])
			) {
			return;
		}
		else {
			$nonce = $_REQUEST['_wpnonce'];
			
			if (!wp_verify_nonce($nonce, 'AFP_NONCE')) {
				return;
			}
			$pid = intval($_REQUEST['pid']);
			if (current_user_can('edit_post', $pid)) {
				$p = $this->change_post_text($pid,$_REQUEST['SMART_EDITOR_POST_VALUE']);
				if ($p > 0) {
					$redirect = add_query_arg(array('msg' => 'approved'), get_permalink($p));
					wp_redirect($redirect);
					exit ;
				} else {
					$redirect = add_query_arg(array('msg' => 'not_approved'), get_permalink());
					wp_redirect($redirect);
					exit ;
				}
				return;
			}
			return;
		}
	}
	function change_post_text($post_id,$content){
		$current_post = get_post($post_id, 'ARRAY_A');
		$current_post['post_content'] = $content;
		return wp_update_post($current_post);
	}

}

$wysipre = new WYSIPREVIEW;
