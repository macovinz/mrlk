<?php

// Enqueue JS and CSS
function mwc_enqueue_assets() {
  $theme_dir = get_template_directory_uri();

  wp_enqueue_script(
    'mwc-frontend',
    $theme_dir . '/assets/index.js',
    array('wp-element', 'react-jsx-runtime'), // required for React in WP
    filemtime(get_template_directory() . '/assets/index.js'),
    true
  );

  wp_enqueue_style(
    'mwc-style',
    $theme_dir . '/assets/index.css',
    array(),
    filemtime(get_template_directory() . '/assets/index.css')
  );
}
add_action('wp_enqueue_scripts', 'mwc_enqueue_assets');

// Add theme support
function mwc_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  register_nav_menus([
    'primary' => __('Primary Menu', 'mwc'),
  ]);
}
add_action('after_setup_theme', 'mwc_setup');

// Register custom post type: Crew Directory



add_filter('acf/fields/google_map/api', function ($api) {
  $api['key'] = 'AIzaSyAF58VWmks948IZ0ioIS0o381BqFp8ws1M';
  return $api;
});


add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');

