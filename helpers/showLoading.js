
const spinner = {
  frames : [
    "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
    "████████▁▁▁▁▁▁▁▁▁▁▁▁",
    "█████████▁▁▁▁▁▁▁▁▁▁▁",
    "██████████▁▁▁▁▁▁▁▁▁▁",
    "███████████▁▁▁▁▁▁▁▁▁",
    "████████████▁▁▁▁▁▁▁▁",
    "█████████████▁▁▁▁▁▁▁",
    "██████████████▁▁▁▁▁▁",
    "███████████████▁▁▁▁▁",
    "████████████████▁▁▁▁",
    "█████████████████▁▁▁",
    "██████████████████▁▁",
    "███████████████████▁",
    "████████████████████"
  ],
  success: '✔',
  error: '✖'
}

/*
  // Usage:
  const spin = new ShowLoading(length)
  spin.loading(count, `Loading photos ${count++}/${len} ...`)
*/

function ShowLoading () {
  this.loading = (iter, initialValue, message) => {
    const frame = Math.floor((iter / initialValue) * 20)
    process.stdout.write('\r' + spinner.frames[frame] + ` ${message} `)
  }
  this.success = () => {
    process.stdout.write('\r' + spinner.success + ` Success!\n`)
  }
  this.failed = () => {
    process.stdout.write('\r' + spinner.error + ` Failed!\n`)
  }
  this.clean = () => {
    process.stdout.write('\r\x1b[K');
  }
}

export default ShowLoading
