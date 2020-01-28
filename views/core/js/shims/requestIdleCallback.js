window.requestIdleCallback =
  window.requestIdleCallback ||
  ((cb) => {
    var start = Date.now();
    return setTimeout(() => {
      const idle = {
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      };
      cb(idle);
    }, 1);
  });

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
