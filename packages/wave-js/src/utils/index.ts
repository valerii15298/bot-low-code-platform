//@ts-nocheck
import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
import Generator from '../core/Generator';
import InvalidGeneratorError from '../core/errors/InvalidGeneratorError';

export const initGlobalObject = (elementId: string, accessKey: string): any => {
  const propertyPath = `${accessKey}.${elementId}`;
  // console.log(setPropertyIfNotSet);
  setPropertyIfNotSet<any>((window as any), propertyPath, {});
  return get(window, propertyPath);
};

export const setPropertyIfNotSet = <T>(object: typeof Object, property: string, value: T): void => {
  // console.log({has}, {set});
  // console.log("ll");
  if (!has(object, property)) {
    set(object, property, value);
  }
}

export const checkGenerator = (generatorType: string | Array<string>): void => {
  (Array.isArray(generatorType) ? generatorType : [generatorType]).forEach((currentGeneratorType) => {
    if (!Object.keys(Generator).map((type: string) => Generator[type]).includes(currentGeneratorType)) {
      throw new InvalidGeneratorError(currentGeneratorType);
    }
  })
}

export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  if (canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
}
