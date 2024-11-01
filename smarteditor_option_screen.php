<?php
/**
 * Smart Editor
 *
 * @package SmartEditor
 * @author Wada Minoru
 **/
class SMART_EDITOR_OPTION_SCREEN {
	private $D_CLASS = "clearfix,align-right,align-left";
	
	function __construct($VERSION){
		if (isset($_POST['smart_editor_options'])) {
			update_option(smart_editor_options,$_POST['smart_editor_options']);
		}
?>
<style type="text/css">
#SmarteditorDonate {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 320px;
    height: 150px;
    border: 3px solid #D88F8F;
    border-radius: 5px;
    padding: 15px;
}
#SmarteditorDonate h3{
    font-size: 32px;
    padding: 0;
    margin: 0 0 0.5em 0;
    color: #D88F8F;
}
.cite {
	text-align: right;
}
</style>

<div id="SMARTEDITOR_OPTION">
<h2>Smart Editor <?php echo $VERSION ?></h2>

<div id="SmarteditorDonate">
<h3>donate</h3>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="7S4MZG2BJWQL8">
<table>
<tr><td><input type="hidden" name="on0" value="Smart Editor">Smart Editor</td></tr><tr><td><select name="os0">
	<option value="Donate!">Donate! $10.00 USD</option>
	<option value="Donate! Donate!">Donate! Donate! $100.00 USD</option>
	<option value="Donaaaaaaaate!">Donaaaaaaaate! $1,000.00 USD</option>
</select> </td></tr>
</table>
<input type="hidden" name="currency_code" value="USD">
<input type="image" src="https://www.paypalobjects.com/ja_JP/JP/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - オンラインでより安全・簡単にお支払い">
<img alt="" border="0" src="https://www.paypalobjects.com/ja_JP/i/scr/pixel.gif" width="1" height="1">
</form>

</div>

<form method="post" action="">
	<?php
	//delete_option( 'smart_editor_options' );
		wp_nonce_field('update-options');
		$opt = get_option('smart_editor_options');
		$classNames = isset($opt['classNames']) ? $opt['classNames']: $this->D_CLASS;
	?>
	<table class="form-table">
		<tr>
			<th><label for="classname"></label><?php _e("The class to be used","smarteditor"); ?></th>
			<td><input type="text" name="smart_editor_options[classNames]" value="<?php echo $classNames; ?>" class="regular-text" />
				<p><?php _e("It divides by a comma.","smarteditor") ?><br />ex : clearfix,m12</p>
			</td>
		</tr>
	</table>	
	
	<p class="submit"><input type="submit" name="Submit" class="button-primary" value="<?php _e('Update Options',"smarteditor") ?> >>" /></p>
</form>
</div>



<?php
	}

}
?>
