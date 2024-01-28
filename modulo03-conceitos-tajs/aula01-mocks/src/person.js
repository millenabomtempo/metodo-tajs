class Person {
  static validate(person) {
    if (!person.name) throw new Error('name is required')
    if (!person.cpf) throw new Error('cpf is required')
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(' ')

    return {
      name,
      lastName: lastName.join(' '),
      cpf: person.cpf.replace(/\D/g, '')
    }
  }

  static save(person) {
    if(!['name', 'lastName', 'cpf'].every(prop => person[prop])) {
      throw new Error(`cannot save invalid person ${JSON.stringify(person)}`)
    }

    console.log('registrado com sucesso', person)
  }

  static process(person) {
    this.validate(person)

    const personFormatted = this.format(person)

    this.save(personFormatted)

    return 'Ok'
  }
}

Person.process({ name: "John Doe", cpf: "123.456.789-00" })

export default Person