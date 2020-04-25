import CyrillicToTranslit = require('cyrillic-to-translit-js');
import { InputConfiguration, OutputConfiguration } from './IOConfiguration';
import { LanguageConfiguration } from './LanguageConfiguration';
import { Task } from './Task';
import { Test } from './Test';
import { TestType } from './TestType';

const cyrillicToLatin = new CyrillicToTranslit();

export class TaskBuilder {
  public name: string = '';

  public judge: string = '';
  public category: string = '';
  public group: string = '';

  public url: string = '';
  public interactive: boolean = false;

  public libstoadd: string = '';

  public memoryLimit: number = 1024;
  public timeLimit: number = 1000;

  public tests: Test[] = [];
  public testType: TestType = TestType.Single;

  public input: InputConfiguration = { type: 'stdin' };
  public output: OutputConfiguration = { type: 'stdout' };

  public languages: LanguageConfiguration = {
    java: {
      mainClass: 'Main',
      taskClass: '',
    },
  };

  public constructor(judge: string) {
    this.judge = judge;
    this.updateGroupFromJudgeCategory();
  }

  public setName(name: string): TaskBuilder {
    this.name = name;
    return this.updateJavaTaskClassFromName();
  }

  public setLibToAdd(libNm: string): TaskBuilder{
    this.libstoadd = libNm;
    return this;
  }

  public setCategory(category: string): TaskBuilder {
    this.category = category;
    return this.updateGroupFromJudgeCategory();
  }

  public setGroup(group: string): TaskBuilder {
    this.group = group;
    return this;
  }

  public setUrl(url: string): TaskBuilder {
    this.url = url;
    return this;
  }

  public setInteractive(interactive: boolean): TaskBuilder {
    this.interactive = interactive;
    return this;
  }

  public setMemoryLimit(memoryLimit: number): TaskBuilder {
    this.memoryLimit = memoryLimit;
    return this;
  }

  public setTimeLimit(timeLimit: number): TaskBuilder {
    this.timeLimit = timeLimit;
    return this;
  }

  public addTest(input: string, output: string): TaskBuilder {
    this.tests.push(new Test(input, output));
    return this;
  }

  public setTestType(type: TestType): TaskBuilder {
    this.testType = type;
    return this;
  }

  public setInput(input: InputConfiguration): TaskBuilder {
    this.input = input;
    return this;
  }

  public setOutput(output: OutputConfiguration): TaskBuilder {
    this.output = output;
    return this;
  }

  public setJavaMainClass(mainClass: string): TaskBuilder {
    this.languages.java.mainClass = mainClass;
    return this;
  }

  public setJavaTaskClass(taskClass: string): TaskBuilder {
    this.languages.java.taskClass = taskClass;
    return this;
  }

  public updateJavaTaskClassFromName(): TaskBuilder {
    const latin = cyrillicToLatin.transform(this.name);
    const name = latin.replace(/[^a-zA-Z0-9_ -]/g, '');

    let taskClass = '';
    let nextCapital = true;

    for (const char of name) {
      const isLetter = /[a-z]/i.test(char);
      const isDigit = /[0-9]/.test(char);

      if (isLetter || (isDigit && taskClass.length > 0)) {
        taskClass += nextCapital ? char.toUpperCase() : char;
        nextCapital = false;
      } else {
        nextCapital = true;
      }
    }

    return this.setJavaTaskClass(taskClass || 'Task');
  }

  public updateGroupFromJudgeCategory(): TaskBuilder {
    // tslint:disable-next-line:prefer-conditional-expression
    if (typeof this.category === 'string' && this.category.trim().length > 0) {
      this.group = `${this.judge} - ${this.category}`;
    } else {
      this.group = this.judge;
    }

    return this;
  }

  public build(): Task {
    return new Task(
      this.name,
      this.group,
      this.url,
      this.interactive,
      this.memoryLimit,
      this.timeLimit,
      this.tests,
      this.testType,
      this.input,
      this.output,
      this.languages,
      this.libstoadd
    );
  }
}
