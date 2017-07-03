
function bar () {
  return new Promise(function(resolve) {
    setTimeout(() => {
      console.log(11);
      resolve();
    }, 1000);
  })
}
async function foo() {
  await bar();
  console.log(22);
}

foo()