import { Denops, vars, helpers } from "./deps/denops_std.ts";
import { isObject } from "./deps/unknownutil.ts";
import { PartialUserConfig, Config, makeConfig } from "./config.ts";
import { ProjectLocal } from "./projectlocal.ts";
import { ProjectLocalFileSystem } from "./fs.ts";
import * as allowlist from "./allowlist.ts";

export function main(denops: Denops) {
  denops.dispatcher = {
    async autosource(): Promise<void> {
      const userConfig = await vars.g.get(denops, "projectlocal", null);
      let config: Config;

      if (isObject<PartialUserConfig>(userConfig)) {
        config = await makeConfig(denops, userConfig);
      } else {
        config = await makeConfig(denops, {});
      }

      const projectLocal = new ProjectLocal(denops, config);
      projectLocal.start();
    },

    async load(): Promise<void> {
      const userConfig = await vars.g.get(denops, "projectlocal", null);
      let config: Config;

      if (isObject<PartialUserConfig>(userConfig)) {
        config = await makeConfig(denops, userConfig);
      } else {
        config = await makeConfig(denops, {});
      }

      const projectLocal = new ProjectLocal(denops, config);
      projectLocal.manualSource();
    },

    async enable(): Promise<void> {
      const userConfig = await vars.g.get(denops, "projectlocal", null);
      let config: Config;

      if (isObject<PartialUserConfig>(userConfig)) {
        config = await makeConfig(denops, userConfig);
      } else {
        config = await makeConfig(denops, {});
      }

      allowlist.autoloadEnable(config);
      helpers.echo(denops, "[projectlocal-vim] Autoload enabled!");
    },

    async disable(): Promise<void> {
      const userConfig = await vars.g.get(denops, "projectlocal", null);
      let config: Config;

      if (isObject<PartialUserConfig>(userConfig)) {
        config = await makeConfig(denops, userConfig);
      } else {
        config = await makeConfig(denops, {});
      }

      allowlist.autoloadDisable(config);
      helpers.echo(denops, "[projectlocal-vim] Autoload disabled!");
    },

    async openLocalConfig(): Promise<void> {
      // Setup Config
      const userConfig = await vars.g.get(denops, "projectlocal", null);
      let config: Config;

      if (isObject<PartialUserConfig>(userConfig)) {
        config = await makeConfig(denops, userConfig);
      } else {
        config = await makeConfig(denops, {});
      }

      const fs = new ProjectLocalFileSystem(denops, config);
      fs.openLocalConfig();
    },
  };
}
