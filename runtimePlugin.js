const runtimeHelpers = require("@module-federation/runtime/helpers");

function getRawSnapshot() {
  const rawSnapshot = document.getElementById("mf-snapshot");
  if (rawSnapshot && rawSnapshot.innerHTML) {
    return JSON.parse(rawSnapshot.innerHTML);
  }
  return;
}

module.exports = function () {
  return {
    name: "custom-plugin-build",
    beforeInit(args) {
      const { nativeGlobal } = runtimeHelpers.global;
      const rawSnapshot = getRawSnapshot();
      if (!nativeGlobal.__INIT_GLOBAL_DATA__ && rawSnapshot) {
        try {
          runtimeHelpers.global.addGlobalSnapshot(rawSnapshot);
          nativeGlobal.__INIT_GLOBAL_DATA__ = true;
        } catch (err) {
          console.error(
            'Parsing the globalSnapshot failed. You can find the global snapshot by using document.getElementById("mf-snapshot").\n The error information is: \n',
            err
          );
        }
      }
      return args;
    },
  };
};
