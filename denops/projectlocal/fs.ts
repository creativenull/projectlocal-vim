import { Denops, helpers } from "./deps/denops_std.ts";
import { fs } from "./deps/std.ts";
import { Config } from "./config.ts";
import {
  projectLocalLuaTemplate,
  projectLocalVimTemplate,
} from "./templates.ts";

export class PLFileSystem {
  constructor(private denops: Denops, private config: Config) {}

  async openLocalConfig(): Promise<void> {
    const filepath = await this.config.getProjectConfigFilepath();

    await helpers.execute(this.denops, `echom "${Deno.cwd()}"`);

    if (!(await PLFileSystem.fileExists(filepath))) {
      await helpers.echo(
        this.denops,
        "[projectlocal-vim] Not detected, creating new local config file!",
      );

      // Create file if it does not exists
      // so that we don't error out on writeTextFile
      await fs.ensureFile(filepath);

      if (this.config.isProjectConfigLua()) {
        await Deno.writeTextFile(filepath, projectLocalLuaTemplate);
      } else {
        await Deno.writeTextFile(filepath, projectLocalVimTemplate);
      }
    }

    await helpers.execute(this.denops, `edit ${filepath}`);
  }

  static async fileExists(filepath: string): Promise<boolean> {
    try {
      await Deno.stat(filepath);
      return true;
    } catch (_) {
      return false;
    }
  }
}
