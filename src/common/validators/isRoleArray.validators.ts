import { Role } from '@prisma/client';
import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function isRole(role: any): role is Role {
  return Object.values(Role).includes(role);
}

export function IsRoleArray(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRoleArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let isArray = Array.isArray(value);

          if (!isArray) return false;

          let v = value as Array<any>;

          for (let i = 0; i < v.length; i++) {
            if (!isRole(v[i])) return false;
          }

          return true;
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a valid Role array',
          validationOptions,
        ),
      },
    });
  };
}
