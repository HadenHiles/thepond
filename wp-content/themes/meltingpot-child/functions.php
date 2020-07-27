<?php
// Set to allow cors from cdn
header("Access-Control-Allow-Origin: *");

/**
* Fix sql strict mode
*/
add_action( 'init', 'mysql_set_sql_mode_traditional', -1);

function mysql_set_sql_mode_traditional() {
    global $wpdb;
    $wpdb->query("SET SESSION sql_mode = ''");
}

/**
* Manually trigger supervisord hook running on thepond DO droplet any time that elementor data is updated or a buddypress avater is uploaded
* - this is required so that styles will be applied
* TODO: figure out a way to automatically invalidate the cache of modified files
*/
add_action( 'elementor/editor/after_save', 'update_the_pond_cdn');
add_action( 'bp_before_profile_edit_cover_image', 'update_the_pond_cdn');
add_action( 'bp_after_profile_avatar_upload_content', 'update_the_pond_cdn');
function update_the_pond_cdn () {
  // sleep for 5 seconds
  sleep(5);

  // Push all changes in uploads folder to ThePondCDN
  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://178.128.232.27:9000/hooks/updatecdn",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
  ));

  $response = curl_exec($curl);

  curl_close($curl);
}

add_action( 'wp_enqueue_scripts', 'child_theme_enqueue_styles' );
function child_theme_enqueue_styles() {

    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}

/**
 * Join posts and postmeta tables
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 */
function cf_search_join( $join ) {
    global $wpdb;

    if ( is_search() ) {
        $join .=' LEFT JOIN '.$wpdb->postmeta. ' ON '. $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
    }

    return $join;
}
add_filter('posts_join', 'cf_search_join' );

function cf_search_where( $where ) {
    global $pagenow, $wpdb;

    if ( is_search() ) {
        $where = preg_replace(
            "/\(\s*".$wpdb->posts.".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "(".$wpdb->posts.".post_title LIKE $1) OR (".$wpdb->postmeta.".meta_value LIKE $1)", $where );
    }

    return $where;
}
add_filter( 'posts_where', 'cf_search_where' );

function cf_search_distinct( $where ) {
    global $wpdb;

    if ( is_search() ) {
        return "DISTINCT";
    }

    return $where;
}
add_filter( 'posts_distinct', 'cf_search_distinct' );

/* Memberpress account tabs */
function mepr_add_tabs($user) {
    ?>
      <span class="mepr-nav-item avatar">
        <!-- KEEPS THE USER ON THE ACCOUNT PAGE -->
        <a href="/account/?action=avatar">Avatar</a>
      </span>
    <?php
  }
  add_action('mepr_account_nav', 'mepr_add_tabs');
  
  function mepr_add_tabs_content($action) {
    if($action == 'avatar') {
      echo do_shortcode('[avatar_upload]');
    }
  }
  add_action('mepr_account_nav_content', 'mepr_add_tabs_content');

  function modify_profile_url( $url, $user_id, $scheme )
  {
      // Makes the link to http://example.com/custom-profile
      $url = site_url( '/account/?action=avatar' );
      return $url;
  }
  add_filter( 'edit_profile_url', 'modify_profile_url', 10, 3 );

/* Shortcodes */
require_once('shortcodes.php');

/* Scripts */
require_once('scripts.php');

// Taxonomies
require_once('taxonomies.php');

// ACF
require_once('acf.php');

// CPT
require_once('cpt.php');