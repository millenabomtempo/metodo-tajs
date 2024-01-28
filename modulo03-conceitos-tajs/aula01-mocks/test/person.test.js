import { describe, it, expect, jest } from "@jest/globals"
import Person from "../src/person.js"

describe("#Person Suite", () => {
  describe("#validate", () => {
    it('should throw if the name is not present', () => {
      const mockInvalidPerson = {
        name: '',
        cpf: '123.456.789-00'
      }

      expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('name is required'))
    })
   
    it('should throw if the cpf is not present', () => {
      const mockInvalidPerson = {
        name: 'John Doe',
        cpf: ''
      }

      expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('cpf is required'))
    })

    it('should not throw if the person is valid', () => {
      const mockValidPerson = {
        name: 'John Doe',
        cpf: '123.456.789-00'
      }

      expect(() => Person.validate(mockValidPerson)).not.toThrow()
    })
  })

  describe("#format", () => {
    it('should format person name and cpf', ()=> {
      const mockPerson = {
        name: "John Doe", 
        cpf: "123.456.789-00"
      }

      const formattedPerson = Person.format(mockPerson)

      const expected = {
        name: 'John',
        lastName: 'Doe',
        cpf: "12345678900"
      }

      expect(formattedPerson).toStrictEqual(expected)
    })
  })

  describe("#save", () => {
    it('should throw if person props are invalid', () => {
      const invalidPerson = {
        name: 'John',
        cpf: '12345678900'
      }

      expect(() => Person.save(invalidPerson)).toThrow(new Error(`cannot save invalid person ${JSON.stringify(invalidPerson)}`))
    })

    it('should not throw if the person is valid', () => {
      const mockValidPerson = {
        name: 'John',
        lastName: 'Doe',
        cpf: "12345678900"
      }

      expect(() => Person.save(mockValidPerson)).not.toThrow()
    })
  })

  describe("#process", () => {
    it('should process a valid person', () => {
      const mockPerson = {
        name: "John Doe", 
        cpf: "123.456.789-00"
      }

      jest.spyOn(Person, Person.validate.name).mockReturnValue()
      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: 'John',
        lastName: 'Doe',
        cpf: "12345678900"
      })

      const result = Person.process(mockPerson)

      expect(result).toStrictEqual('Ok')
    })
  })
})