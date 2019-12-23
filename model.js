class Model {
  constructor () {
    this.resetState()
    this.runTimes = 1000
  }

  setRunTimes (n) {
    this.runTimes = n
  }

  resetState () {
    this.variables = {}
  }

  runSetup (lines) {
    // For each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].split('=')
      this.variables[line[0]] = (Number(line[1]))
    }
    return true
  }

  linesToCode (lines) {
    let result = ''

    // For each line
    for (let i = 0; i < lines.length; i++) {
      // Turn the line into a class.
      const line = new Line(lines[i])
      if (line.sanitize()) {
        line.split()
        line.checkExcistence()
        line.addPrefix()
        line.finishFormat()

        result += line.content
      }
    }
    return result
  }

  runLoop (lines) {
    const history = {}
    // Change the lines to executable code.
    const totalCode = this.linesToCode(lines)

    // Copy this.variables to history, but use arrays as values
    // with the original value as first item
    for (const n in this.variables) {
      history[n] = [this.variables[n]]
    }

    // Run as many times as determined by the user input
    for (let x = 0; x < this.runTimes; x++) {
      const stop = false
      eval(totalCode) // Execute the code.
      for (const n in this.variables) {
        // Make the value a number with maximum of n digits
        const value = Math.round(Number((this.variables[n])) * 1000) / 1000

        // Add the value of this.variables to history for the corresponding key.
        history[n].push(value)
      }
      if (stop) break
    }
    return history
  }
}
