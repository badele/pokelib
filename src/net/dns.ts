/**
 * Read the /etc/resolv.conf content file
 *
 * @Returns - Return the nameserver list
 * sample: getNameservers(Deno.build.os)
 */

export async function getNameserversLinux(): Promise<string[]> {
  let servers: string[] = [];

  const resolvconf = await Deno.readTextFile("/etc/resolv.conf");
  const regex = /nameserver ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|[A-Z0-9:]+)/g;
  const results = resolvconf.matchAll(regex);

  servers = Array.from(
    results,
    (results) => results[1],
  );

  return servers;
}

export async function getNameserversWindows(): Promise<string[]> {
  let servers: string[] = [];

  const command = new Deno.Command("nslookup", {
    args: [
      "nodomain",
    ],
  });

  const { stdout } = await command.output();
  const address = new TextDecoder().decode(stdout);
  const regex = /Address:.*?([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|[A-Z0-9:]+)/g;
  const results = address.matchAll(regex);

  servers = Array.from(
    results,
    (results) => results[1],
  );

  return servers;
}

export async function getNameservers(os: string): Promise<string[]> {
  let servers: string[] = [];

  switch (os) {
    case "linux": {
      servers = await _internals.getNameserversLinux();
      break;
    }
    case "windows": {
      servers = await _internals.getNameserversWindows();
      break;
    }
    default:
      console.error(`${Deno.build.os} Operating System does not supported`);
      Deno.exit(1);
  }

  return servers;
}

export const _internals = {
  getNameservers,
  getNameserversLinux,
  getNameserversWindows,
};
