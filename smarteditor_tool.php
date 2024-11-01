<?php
/**
 * Smart Editor
 *
 * @package Smart Editor
 * @author Wada Minoru
 **/

class SMART_EDITOR_tool {
	
	function __construct($VERSION){
	?>
	<div id="SMART_EDITOR_TOOL">
		<?php
		global $post;
		
		
		echo '<form name="post" action="?p=' . $post -> ID . '&preview=true" method="post" id="post">';
		wp_nonce_field("AFP_NONCE");
		?>
		<input type="hidden" id="action" name="action" value="AFP">
		<input type="hidden" id="pid" name="pid" value="<?php echo $post -> ID; ?>">
	
		<div id="SMART_EDITOR_TAG_PATH">
			
		</div>
		<table id="SMART_EDITOR_BTNS">
			<tr>
				<td id="SmartEditorHandTD"><h3 id="SMART_EDITOR_HAND_AREA"><span class="hand"></span>Smart Editor <?php echo $VERSION ?></h3></td>
				
				<td><a href="#" id="SMART_EDITOR_SAVE_BTN" class="saveBtn button"><?php _e("Save"); ?></a></td>
				<td><a class="smarteditor-tool-write smarteditorBtn" data-tag="write" data-command="write" href="#">write</a></td>
				<td class="smarteditor-formatselect smarteditorMenu"><div class="pos-relative">
					<p><a class="nowFormat smarteditorFlowMenuBtn"><?php _e("Paragraph"); ?></a></p>
					<ul>
						<li><a class="smarteditorBtn" data-tag="p"	data-command="formatBlock" href="#" title="<?php _e("Paragraph"); ?>"><?php _e("Paragraph"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="address" data-command="formatBlock" href="#" title="<?php _e("Address"); ?>"><?php _e("Address"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="blockquote" data-command="formatBlock" href="#" title="<?php _e("Blockquote"); ?>"><?php _e("Blockquote"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="pre" data-command="formatBlock" href="#" title="<?php _e("Preformatted"); ?>"><?php _e("Preformatted"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h1"	data-command="formatBlock" href="#" title="<?php _e("Heading 1"); ?>"><?php _e("Heading 1"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h2"	data-command="formatBlock" href="#" title="<?php _e("Heading 2"); ?>"><?php _e("Heading 2"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h3"	data-command="formatBlock" href="#" title="<?php _e("Heading 3"); ?>"><?php _e("Heading 3"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h4"	data-command="formatBlock" href="#" title="<?php _e("Heading 4"); ?>"><?php _e("Heading 4"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h5"	data-command="formatBlock" href="#" title="<?php _e("Heading 5"); ?>"><?php _e("Heading 5"); ?></a></li>
						<li><a class="smarteditorBtn" data-tag="h6"	data-command="formatBlock" href="#" title="<?php _e("Heading 6"); ?>"><?php _e("Heading 6"); ?></a></li>
					</ul></div>
				</td>
				<td><a class="smarteditor-tool-underline smarteditorBtn" data-tag="u" data-command="underline" href="#" title="underline">underline</a></td>
				<td><a class="smarteditor-tool-italic smarteditorBtn" data-tag="i" data-command="italic" href="#" title="i">i</a></td>
				<td><a class="smarteditor-tool-em smarteditorBtn" data-tag="em"	data-command="em" href="#" title="em"><em>em</em></a></td>
				<td><a class="smarteditor-tool-strong smarteditorBtn" data-tag="strong"	data-command="strong" href="#" title="strong"><strong>strong</strong></a></td>
				<td><a class="smarteditor-tool-ul smarteditorBtn" data-tag="ul" data-command="insertUnorderedList" href="#" title="ul">ul</a></td>
				<td><a class="smarteditor-tool-ol smarteditorBtn" data-tag="ol" data-command="insertOrderedList" href="#" title="ol">ol</a></td>
				<td class="smarteditor-align-menu smarteditorBtnMenu"><div class="pos-relative">
					<p><a class="nowAlign smarteditorFlowMenuBtn"></a></p>
					<ul>
						<li><a class="smarteditorBtn justifyLeft" data-tag="justifyLeft" data-command="justify" href="#" title="<?php _e("Align Left","smarteditor"); ?>">justifyLeft</a></li>
						<li><a class="smarteditorBtn justifyCenter" data-tag="justifyCenter" data-command="justify" href="#" title="<?php _e("Align Center","smarteditor"); ?>">justifyCenter</a></li>
						<li><a class="smarteditorBtn justifyRight" data-tag="justifyRight" data-command="justify" href="#" title="<?php _e("Align Right","smarteditor"); ?>">justifyRight</a></li>
					</ul></div>
				</td>
				<td class="smarteditor-link-menu smarteditorBtnMenu"><div class="pos-relative">
					<p><a class="nowLink smarteditorFlowMenuBtn"></a></p>
					<ul>
						<li><a class="smarteditor-tool-link smarteditorBtn" id="smarteditor-linkBtn" data-tag="a" data-command="createLink" href="#" title="<?php _e("Insert link"); ?>"><?php _e("Insert link"); ?></a></li>
						<li><a class="smarteditor-tool-nolink smarteditorBtn" id="smarteditor-nolinkBtn" data-tag="a" data-command="createLink" href="#" title="<?php _e("Remove link"); ?>"><?php _e("Insert link"); ?></a></li>
					</ul></div>
				</td>
				<td><a class="smarteditor-tool-media smarteditorBtn" id="smarteditor-mediaupoaderBtn" data-tag="img"	data-command="tmp"  href="#" title="<?php _e("Add Media"); ?>"><?php _e("Add Media"); ?></a></td>
				<!-- <td><a class="smarteditor-tool-css smarteditorBtn" id="smarteditor-cssBtn" data-tag="css"	data-command="css"  href="#"><?php _e("Stylesheet"); ?></a></td> -->
				<td><a class="smarteditor-tool-source smarteditorBtn" id="smarteditor-sourceBtn" data-tag="source"	data-command="source"  href="#" title="<?php _e("Edit HTML Source"); ?>"><?php _e("Edit HTML Source"); ?></a></td>
				<td><a class="smarteditor-tool-element smarteditorBtn" id="smarteditor-elementBtn" data-tag="element"	data-command="element"  href="#" title="<?php _e("opne element window","smarteditor"); ?>">opne element window</a></td>
			</tr>
		</table>
		<textarea style="display: none" id="SMART_EDITOR_POST_CONTENT" name="SMART_EDITOR_POST_VALUE"></textarea>
		<!-- <input type="text" id="WYSIPRE_POST_TITLE" name="WYSIPRE_POST_TITLE" value="<?php the_title(); ?>" /> -->
		</form>
	
	</div>
	<!-- <script type="text/javascript">var smarteditor = WYSIPRE("WYSIPREVIEW");</script> -->
	<?php
	
	}

}
?>
