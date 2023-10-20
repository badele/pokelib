import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.203.0/testing/mock.ts";
import { assertEquals } from "../../test_deps.ts";
import { _internals } from "./dns.ts";

Deno.test("Check getting nameserver", async () => {
  const getNameserversStub = stub(
    _internals,
    "getNameservers",
    returnsNext([
      Promise.resolve(["192.168.11.11"]),
      Promise.resolve(["192.168.22.22"]),
    ]),
  );

  const getNameserversLinuxStub = stub(
    _internals,
    "getNameserversLinux",
    returnsNext([
      Promise.resolve(["192.168.11.11"]),
    ]),
  );

  const getNameserversWindowsStub = stub(
    _internals,
    "getNameserversWindows",
    returnsNext([
      Promise.resolve(["192.168.22.22"]),
    ]),
  );

  try {
    let result = await _internals.getNameservers("linux");
    assertEquals(result, ["192.168.11.11"]);

    result = await _internals.getNameservers("windows");
    assertEquals(result, ["192.168.22.22"]);
  } finally {
    // unwraps the functions on the _internals object
    getNameserversStub.restore();
    getNameserversLinuxStub.restore();
    getNameserversWindowsStub.restore();
  }

  // Analyse previous requests
  assertSpyCall(getNameserversStub, 0, { args: ["linux"] });
  assertSpyCall(getNameserversStub, 1, { args: ["windows"] });
  assertSpyCalls(getNameserversStub, 2);
});
