with import <nixpkgs> {};

let
  nodejs = nodejs-16_x;
  electron = electron_16;
in
  mkShell {
    nativeBuildInputs = [
      nodejs
      yarn
      electron
    ];

    ELECTRON_OVERRIDE_DIST_PATH = "${electron}/bin/";
  }
