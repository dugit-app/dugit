dugit
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dugit.svg)](https://npmjs.org/package/dugit)
[![Downloads/week](https://img.shields.io/npm/dw/dugit.svg)](https://npmjs.org/package/dugit)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dugit
$ dugit COMMAND
running command...
$ dugit (--version)
dugit/0.0.5 linux-x64 node-v18.20.4
$ dugit --help [COMMAND]
USAGE
  $ dugit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dugit help [COMMAND]`](#dugit-help-command)
* [`dugit plugins`](#dugit-plugins)
* [`dugit plugins add PLUGIN`](#dugit-plugins-add-plugin)
* [`dugit plugins:inspect PLUGIN...`](#dugit-pluginsinspect-plugin)
* [`dugit plugins install PLUGIN`](#dugit-plugins-install-plugin)
* [`dugit plugins link PATH`](#dugit-plugins-link-path)
* [`dugit plugins remove [PLUGIN]`](#dugit-plugins-remove-plugin)
* [`dugit plugins reset`](#dugit-plugins-reset)
* [`dugit plugins uninstall [PLUGIN]`](#dugit-plugins-uninstall-plugin)
* [`dugit plugins unlink [PLUGIN]`](#dugit-plugins-unlink-plugin)
* [`dugit plugins update`](#dugit-plugins-update)

## `dugit help [COMMAND]`

Display help for dugit.

```
USAGE
  $ dugit help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for dugit.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.8/src/commands/help.ts)_

## `dugit plugins`

List installed plugins.

```
USAGE
  $ dugit plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ dugit plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/index.ts)_

## `dugit plugins add PLUGIN`

Installs a plugin into dugit.

```
USAGE
  $ dugit plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dugit.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DUGIT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DUGIT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dugit plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dugit plugins add myplugin

  Install a plugin from a github url.

    $ dugit plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dugit plugins add someuser/someplugin
```

## `dugit plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ dugit plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ dugit plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/inspect.ts)_

## `dugit plugins install PLUGIN`

Installs a plugin into dugit.

```
USAGE
  $ dugit plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dugit.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DUGIT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DUGIT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dugit plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dugit plugins install myplugin

  Install a plugin from a github url.

    $ dugit plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dugit plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/install.ts)_

## `dugit plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ dugit plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ dugit plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/link.ts)_

## `dugit plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dugit plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dugit plugins unlink
  $ dugit plugins remove

EXAMPLES
  $ dugit plugins remove myplugin
```

## `dugit plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ dugit plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/reset.ts)_

## `dugit plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dugit plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dugit plugins unlink
  $ dugit plugins remove

EXAMPLES
  $ dugit plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/uninstall.ts)_

## `dugit plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dugit plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dugit plugins unlink
  $ dugit plugins remove

EXAMPLES
  $ dugit plugins unlink myplugin
```

## `dugit plugins update`

Update installed plugins.

```
USAGE
  $ dugit plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
