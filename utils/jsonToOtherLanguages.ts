/**
 * JSON 转其他语言数据结构工具函数
 */
import { IAnyObj } from "@utils/type";

// 生成JavaScript类
export const generateJavaScriptClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${className} {\n`;
    classCode += `  constructor(data) {\n`;

    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      classCode += `    this.${propertyName} = data.${key};\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          const nestedClassName = capitalize(propertyName);
          nestedClasses.push(generateClass(value as IAnyObj, nestedClassName));
          classCode += `    if (data.${key}) {\n`;
          classCode += `      this.${propertyName} = new ${nestedClassName}(data.${key});\n`;
          classCode += `    }\n`;
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = capitalize(propertyName.endsWith('s') ? propertyName.slice(0, -1) : propertyName);
        nestedClasses.push(generateClass(value[0], nestedClassName));
        classCode += `    if (data.${key}) {\n`;
        classCode += `      this.${propertyName} = data.${key}.map(item => new ${nestedClassName}(item));\n`;
        classCode += `    }\n`;
      }
    });

    classCode += `  }\n`;
    classCode += `}\n\n`;

    return nestedClasses.join('\n') + classCode;
  };

  return generateClass(obj);
};

// 生成TypeScript接口
export const generateTypeScriptInterface = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const generateInterface = (obj: IAnyObj, interfaceName: string = 'Root'): { code: string, interfaceName: string } => {
    if (typeof obj !== 'object' || obj === null) {
      return { code: '', interfaceName: 'any' };
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        const nested = generateInterface(obj[0], interfaceName);
        return {
          code: nested.code,
          interfaceName: `${nested.interfaceName}[]`
        };
      } else if (obj.length > 0) {
        return { code: '', interfaceName: `${typeof obj[0]}[]` };
      }
      return { code: '', interfaceName: 'any[]' };
    }

    let interfaceCode = `interface ${interfaceName} {\n`;
    const nestedInterfaces: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            const nestedInterfaceName = capitalize(propertyName);
            const nested = generateInterface(value[0], nestedInterfaceName);
            if (nested.code) {
              nestedInterfaces.push(nested.code);
            }
            interfaceCode += `  ${propertyName}: ${nested.interfaceName};\n`;
          } else if (value.length > 0) {
            interfaceCode += `  ${propertyName}: ${typeof value[0]}[];\n`;
          } else {
            interfaceCode += `  ${propertyName}: any[];\n`;
          }
        } else {
          if (Object.keys(value).length > 0) {
            const nestedInterfaceName = capitalize(propertyName);
            const nested = generateInterface(value as IAnyObj, nestedInterfaceName);
            if (nested.code) {
              nestedInterfaces.push(nested.code);
            }
            interfaceCode += `  ${propertyName}: ${nested.interfaceName};\n`;
          } else {
            interfaceCode += `  ${propertyName}: any;\n`;
          }
        }
      } else {
        interfaceCode += `  ${propertyName}: ${typeof value};\n`;
      }
    });

    interfaceCode += '}\n\n';

    return {
      code: nestedInterfaces.join('') + interfaceCode,
      interfaceName
    };
  };

  const result = generateInterface(obj);
  return result.code;
};

// 生成Python类
export const generatePythonClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${className}:\n`;
    classCode += `    def __init__(self, data):\n`;

    if (Object.keys(obj).length === 0) {
      classCode += `        pass\n\n`;
      return classCode;
    }

    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      classCode += `        self.${propertyName} = data.get('${key}')\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          const nestedClassName = capitalize(propertyName);
          nestedClasses.push(generateClass(value as IAnyObj, nestedClassName));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = capitalize(propertyName.endsWith('s') ? propertyName.slice(0, -1) : propertyName);
        nestedClasses.push(generateClass(value[0], nestedClassName));
      }
    });

    classCode += '\n';

    return nestedClasses.join('\n') + classCode;
  };

  return generateClass(obj);
};

// 生成Java类
export const generateJavaClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `public class ${className} {\n`;

    if (Object.keys(obj).length === 0) {
      classCode += '}\n\n';
      return classCode;
    }

    const fields: string[] = [];
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const fieldName = capitalize(propertyName);

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            const nestedClassName = capitalize(propertyName.endsWith('s') ? propertyName.slice(0, -1) : propertyName);
            nestedClasses.push(generateClass(value[0], nestedClassName));
            fields.push(`    private List<${nestedClassName}> ${propertyName};`);
          } else if (value.length > 0) {
            fields.push(`    private List<${capitalize(typeof value[0])}> ${propertyName};`);
          } else {
            fields.push(`    private List<Object> ${propertyName};`);
          }
        } else {
          if (Object.keys(value).length > 0) {
            const nestedClassName = capitalize(propertyName);
            nestedClasses.push(generateClass(value as IAnyObj, nestedClassName));
            fields.push(`    private ${nestedClassName} ${propertyName};`);
          } else {
            fields.push(`    private Object ${propertyName};`);
          }
        }
      } else {
        const javaType =
          typeof value === 'string' ? 'String' :
            typeof value === 'number' ? (Number.isInteger(value) ? 'int' : 'double') :
              typeof value === 'boolean' ? 'boolean' :
                'Object';
        fields.push(`    private ${javaType} ${propertyName};`);
      }
    });

    // 添加字段
    fields.forEach(field => {
      classCode += `${field}\n`;
    });

    classCode += '\n';

    // 添加构造函数
    classCode += `    public ${className}() {}\n\n`;

    // 添加getter和setter方法
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const fieldName = capitalize(propertyName);

      const javaType =
        typeof value === 'object' && value !== null ?
          (Array.isArray(value) ?
            (value.length > 0 && typeof value[0] === 'object' && value[0] !== null ?
              `List<${capitalize(propertyName.endsWith('s') ? propertyName.slice(0, -1) : propertyName)}>` :
              `List<${value.length > 0 ? capitalize(typeof value[0]) : 'Object'}>`) :
            capitalize(propertyName)) :
          typeof value === 'string' ? 'String' :
            typeof value === 'number' ? (Number.isInteger(value) ? 'int' : 'double') :
              typeof value === 'boolean' ? 'boolean' :
                'Object';

      classCode += `    public ${javaType} get${fieldName}() {\n`;
      classCode += `        return this.${propertyName};\n`;
      classCode += `    }\n\n`;

      classCode += `    public void set${fieldName}(${javaType} ${propertyName}) {\n`;
      classCode += `        this.${propertyName} = ${propertyName};\n`;
      classCode += `    }\n\n`;
    });

    classCode += '}\n\n';

    return nestedClasses.join('') + classCode;
  };

  return generateClass(obj);
};

// 生成C++类
export const generateCppClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${className} {\n`;
    classCode += 'public:\n';

    const fields: string[] = [];
    const nestedClasses: string[] = [];

    if (Object.keys(obj).length === 0) {
      classCode += `    ${className}() = default;\n`;
      classCode += '};\n\n';
      return classCode;
    }

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            const nestedClassName = capitalize(propertyName.endsWith('s') ? propertyName.slice(0, -1) : propertyName);
            nestedClasses.push(generateClass(value[0], nestedClassName));
            fields.push(`    std::vector<${nestedClassName}> ${propertyName};`);
          } else if (value.length > 0) {
            const cppType =
              typeof value[0] === 'string' ? 'std::string' :
                typeof value[0] === 'number' ? (Number.isInteger(value[0]) ? 'int' : 'double') :
                  typeof value[0] === 'boolean' ? 'bool' :
                    'void*';
            fields.push(`    std::vector<${cppType}> ${propertyName};`);
          } else {
            fields.push(`    std::vector<void*> ${propertyName};`);
          }
        } else {
          if (Object.keys(value).length > 0) {
            const nestedClassName = capitalize(propertyName);
            nestedClasses.push(generateClass(value as IAnyObj, nestedClassName));
            fields.push(`    ${nestedClassName} ${propertyName};`);
          } else {
            fields.push(`    void* ${propertyName};`);
          }
        }
      } else {
        const cppType =
          typeof value === 'string' ? 'std::string' :
            typeof value === 'number' ? (Number.isInteger(value) ? 'int' : 'double') :
              typeof value === 'boolean' ? 'bool' :
                'void*';
        fields.push(`    ${cppType} ${propertyName};`);
      }
    });

    // 添加字段
    fields.forEach(field => {
      classCode += `${field}\n`;
    });

    classCode += '\n';
    classCode += `    ${className}() = default;\n`;
    classCode += '};\n\n';

    return nestedClasses.join('') + classCode;
  };

  return generateClass(obj);
};

// 生成JSON Schema
export const generateJsonSchema = (obj: IAnyObj): string => {
  const generateSchema = (obj: IAnyObj): IAnyObj => {
    if (obj === null) {
      return { type: 'null' };
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return { type: 'array', items: {} };
      }

      // 获取数组中第一个元素的类型作为示例
      const firstItemType = generateSchema(obj[0]);
      return {
        type: 'array',
        items: firstItemType
      };
    }

    if (typeof obj === 'object') {
      const schema: IAnyObj = {
        type: 'object',
        properties: {},
        required: Object.keys(obj)
      };

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          (schema.properties as IAnyObj)[key] = generateSchema(obj[key] as IAnyObj);
        }
      }

      return schema;
    }

    return { type: typeof obj };
  };

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Generated Schema",
    ...generateSchema(obj)
  };

  return JSON.stringify(schema, null, 2);
};

// 生成Go结构体
export const generateGoStruct = (obj: IAnyObj): string => {
  const toCamelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
      .replace(/^([A-Z])/, (group) => group.toLowerCase());
  };

  const toPascalCase = (str: string) => {
    const camelCase = toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  const getGoType = (value: IAnyObj): string => {
    if (value === null) return 'interface{}';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]interface{}';
      return `[]${getGoType(value[0])}`;
    }
    if (typeof value === 'object') return `*${toPascalCase(Object.keys(value)[0] || 'Object')}`;
    switch (typeof value) {
      case 'string':
        return 'string';
      case 'number':
        return Number.isInteger(value) ? 'int' : 'float64';
      case 'boolean':
        return 'bool';
      default:
        return 'interface{}';
    }
  };

  const generateStruct = (obj: IAnyObj, structName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateStruct(obj[0], structName);
      }
      return '';
    }

    let structCode = `type ${toPascalCase(structName)} struct {\n`;
    const nestedStructs: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const fieldName = toPascalCase(key);
      const jsonTag = key.includes('-') || key.includes('_') ? ' `json:"' + key + '"`' : '';
      const fieldType = getGoType(value as IAnyObj);

      structCode += `    ${fieldName} ${fieldType}${jsonTag}\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedStructs.push(generateStruct(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedStructName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedStructs.push(generateStruct(value[0], nestedStructName));
      }
    });

    structCode += '}\n\n';

    return nestedStructs.join('') + structCode;
  };

  return 'package main\n\n' + generateStruct(obj);
};

// 生成Rust结构体
export const generateRustStruct = (obj: IAnyObj): string => {
  const toSnakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  };

  const toPascalCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getRustType = (value: IAnyObj): string => {
    if (value === null) return 'Option<serde_json::Value>';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<serde_json::Value>';
      return `Vec<${getRustType(value[0])}>`;
    }
    if (typeof value === 'object') return toPascalCase(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return Number.isInteger(value) ? 'i32' : 'f64';
      case 'boolean': return 'bool';
      default: return 'serde_json::Value';
    }
  };

  const generateStruct = (obj: IAnyObj, structName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateStruct(obj[0], structName);
      }
      return '';
    }

    let structCode = '#[derive(Serialize, Deserialize, Debug)]\n';
    structCode += `struct ${toPascalCase(structName)} {\n`;
    const nestedStructs: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const fieldName = toSnakeCase(key);
      const fieldType = getRustType(value as IAnyObj);

      structCode += `    ${fieldName}: ${fieldType},\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedStructs.push(generateStruct(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedStructName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedStructs.push(generateStruct(value[0], nestedStructName));
      }
    });

    structCode += '}\n\n';

    return nestedStructs.join('') + structCode;
  };

  return '#[macro_use]\nextern crate serde_derive;\n\n' + generateStruct(obj);
};

// 生成Objective-C类
export const generateObjectiveCClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getObjCType = (value: IAnyObj): string => {
    if (value === null) return 'id';
    if (Array.isArray(value)) return 'NSArray*';
    if (typeof value === 'object') return `${capitalize(Object.keys(value)[0] || 'Object')}*`;
    switch (typeof value) {
      case 'string': return 'NSString*';
      case 'number': return Number.isInteger(value) ? 'NSInteger' : 'CGFloat';
      case 'boolean': return 'BOOL';
      default: return 'id';
    }
  };

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    // Header部分
    let headerCode = `@interface ${capitalize(className)} : NSObject\n\n`;
    const properties: string[] = [];
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const propertyType = getObjCType(value as IAnyObj);

      properties.push(`@property (nonatomic, strong) ${propertyType} ${propertyName};`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedClasses.push(generateClass(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedClasses.push(generateClass(value[0], nestedClassName));
      }
    });

    headerCode += properties.join('\n') + '\n\n';
    headerCode += '- (instancetype)initWithDictionary:(NSDictionary*)dict;\n';
    headerCode += '@end\n\n';

    // Implementation部分
    let implCode = `@implementation ${capitalize(className)}\n\n`;
    implCode += '- (instancetype)initWithDictionary:(NSDictionary*)dict {\n';
    implCode += '    if (self = [super init]) {\n';

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          implCode += `        _${propertyName} = [[${capitalize(propertyName)} alloc] initWithDictionary:dict[@"${key}"]];\n`;
        } else {
          implCode += `        _${propertyName} = dict[@"${key}"];\n`;
        }
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = capitalize(key.endsWith('s') ? key.slice(0, -1) : key);
        implCode += `        NSMutableArray* ${propertyName}Array = [NSMutableArray array];\n`;
        implCode += '        for (NSDictionary* item in dict[@"' + key + '"]) {\n';
        implCode += `            [${propertyName}Array addObject:[[${nestedClassName}] alloc] initWithDictionary:item]];\n`;
        implCode += '        }\n';
        implCode += `        _${propertyName} = [${propertyName}Array copy];\n`;
      } else {
        implCode += `        _${propertyName} = dict[@"${key}"];\n`;
      }
    });

    implCode += '    }\n';
    implCode += '    return self;\n';
    implCode += '}\n\n';
    implCode += '@end\n\n';

    return nestedClasses.join('') + headerCode + implCode;
  };

  return generateClass(obj);
};

// 生成Swift结构体
export const generateSwiftStruct = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getSwiftType = (value: IAnyObj): string => {
    if (value === null) return 'Any?';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[Any?]?';
      return `[${getSwiftType(value[0])}]?`;
    }
    if (typeof value === 'object') return `${capitalize(Object.keys(value)[0] || 'Object')}?`;
    switch (typeof value) {
      case 'string': return 'String?';
      case 'number': return Number.isInteger(value) ? 'Int?' : 'Double?';
      case 'boolean': return 'Bool?';
      default: return 'Any?';
    }
  };

  const generateStruct = (obj: IAnyObj, structName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateStruct(obj[0], structName);
      }
      return '';
    }

    let structCode = `struct ${capitalize(structName)}: Codable {\n`;
    const properties: string[] = [];
    const nestedStructs: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const propertyType = getSwiftType(value as IAnyObj);

      properties.push(`    let ${propertyName}: ${propertyType}`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedStructs.push(generateStruct(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedStructName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedStructs.push(generateStruct(value[0], nestedStructName));
      }
    });

    structCode += properties.join('\n') + '\n\n';

    // 添加CodingKeys枚举（如果属性名与JSON键名不一致）
    const hasSpecialKeys = Object.keys(obj).some(key =>
      key.replace(/[^a-zA-Z0-9$_]/g, '_') !== key
    );

    if (hasSpecialKeys) {
      structCode += '    enum CodingKeys: String, CodingKey {\n';
      Object.keys(obj).forEach(key => {
        const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
        if (propertyName !== key) {
          structCode += '        case ' + propertyName + ' = "' + key + '"\n';
        } else {
          structCode += `        case ${propertyName}\n`;
        }
      });
      structCode += '    }\n';
    }

    structCode += '}\n\n';

    return nestedStructs.join('') + structCode;
  };

  return generateStruct(obj);
};

// 生成Crystal类
export const generateCrystalClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getCrystalType = (value: IAnyObj): string => {
    if (value === null) return 'Nil';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Array';
      return `Array(${getCrystalType(value[0])})`;
    }
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return Number.isInteger(value) ? 'Int32' : 'Float64';
      case 'boolean': return 'Bool';
      default: return 'Any';
    }
  };

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${capitalize(className)}\n`;
    const properties: string[] = [];
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      const propertyType = getCrystalType(value as IAnyObj);

      properties.push(`  property ${propertyName} : ${propertyType}?`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedClasses.push(generateClass(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedClasses.push(generateClass(value[0], nestedClassName));
      }
    });

    classCode += properties.join('\n') + '\n\n';
    classCode += `  def initialize(@${Object.keys(obj).map(key => key.replace(/[^a-zA-Z0-9_]/g, '_')).join(', @')} : Nil)\n`;
    classCode += '  end\n';
    classCode += 'end\n\n';

    return nestedClasses.join('') + classCode;
  };

  return generateClass(obj);
};

// 生成JS PropTypes
export const generateJSPropTypes = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getPropType = (value: IAnyObj): string => {
    if (value === null) return 'PropTypes.any';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'PropTypes.array';
      return `PropTypes.arrayOf(${getPropType(value[0])})`;
    }
    if (typeof value === 'object') return 'PropTypes.shape({\n' + generatePropTypes(value) + '\n  })';
    switch (typeof value) {
      case 'string': return 'PropTypes.string';
      case 'number': return 'PropTypes.number';
      case 'boolean': return 'PropTypes.bool';
      default: return 'PropTypes.any';
    }
  };

  const generatePropTypes = (obj: IAnyObj): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generatePropTypes(obj[0]);
      }
      return '';
    }

    const propTypes: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const propType = getPropType(value as IAnyObj);

      propTypes.push(`  ${propertyName}: ${propType}`);
    });

    return propTypes.join(',\n');
  };

  return 'import PropTypes from \'prop-types\';\n\nconst propTypes = {\n' + generatePropTypes(obj) + '\n};\n\nexport default propTypes;';
};

// 生成Flow类型
export const generateFlowType = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getFlowType = (value: IAnyObj): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Array<mixed>';
      return `Array<${getFlowType(value[0])}>`;
    }
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      default: return 'mixed';
    }
  };

  const generateType = (obj: IAnyObj, typeName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateType(obj[0], typeName);
      }
      return '';
    }

    let typeCode = `type ${capitalize(typeName)} = {|\n`;
    const nestedTypes: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const propertyType = getFlowType(value as IAnyObj);
      const optional = value === null ? '?' : '';

      typeCode += `  ${propertyName}${optional}: ${propertyType},\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedTypes.push(generateType(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedTypeName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedTypes.push(generateType(value[0], nestedTypeName));
      }
    });

    typeCode += '|};\n\n';

    return nestedTypes.join('') + typeCode;
  };

  return '// @flow\n\n' + generateType(obj);
};

// 生成Kotlin数据类
export const generateKotlinDataClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getKotlinType = (value: IAnyObj): string => {
    if (value === null) return 'Any?';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Any?>';
      return `List<${getKotlinType(value[0])}>`;
    }
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return Number.isInteger(value) ? 'Int' : 'Double';
      case 'boolean': return 'Boolean';
      default: return 'Any?';
    }
  };

  const generateDataClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateDataClass(obj[0], className);
      }
      return '';
    }

    let classCode = `data class ${capitalize(className)}(\n`;
    const properties: string[] = [];
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9$_]/g, '_');
      const propertyType = getKotlinType(value as IAnyObj);

      properties.push(`    val ${propertyName}: ${propertyType}`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedClasses.push(generateDataClass(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedClasses.push(generateDataClass(value[0], nestedClassName));
      }
    });

    classCode += properties.join(',\n') + '\n)\n\n';

    return nestedClasses.join('') + classCode;
  };

  return generateDataClass(obj);
};

// 生成Elm类型
export const generateElmType = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getElmType = (value: IAnyObj): string => {
    if (value === null) return 'Maybe a';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List a';
      return `List ${getElmType(value[0])}`;
    }
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return Number.isInteger(value) ? 'Int' : 'Float';
      case 'boolean': return 'Bool';
      default: return 'a';
    }
  };

  const generateType = (obj: IAnyObj, typeName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateType(obj[0], typeName);
      }
      return '';
    }

    let typeCode = `type alias ${capitalize(typeName)} =\n  { `;
    const fields: string[] = [];
    const nestedTypes: string[] = [];

    Object.keys(obj).forEach((key, index) => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      const propertyType = getElmType(value as IAnyObj);

      fields.push(`${propertyName} : ${propertyType}`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedTypes.push(generateType(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedTypeName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedTypes.push(generateType(value[0], nestedTypeName));
      }
    });

    typeCode += fields.join('\n  , ') + '\n  }\n\n';

    return nestedTypes.join('') + typeCode;
  };

  return generateType(obj);
};

// 生成Ruby类
export const generateRubyClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getRubyType = (value: IAnyObj): string => {
    if (value === null) return 'nil';
    if (Array.isArray(value)) return 'Array';
    if (typeof value === 'object') return 'Hash';
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return 'Numeric';
      case 'boolean': return 'Boolean';
      default: return 'Object';
    }
  };

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${capitalize(className)}\n`;
    classCode += `  attr_accessor `;

    const properties = Object.keys(obj).map(key => `:${key.replace(/[^a-zA-Z0-9_]/g, '_')}`);
    classCode += properties.join(', ') + '\n\n';

    classCode += `  def initialize(data)\n`;
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      classCode += `    @${propertyName} = data['${key}']\n`;

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedClasses.push(generateClass(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedClasses.push(generateClass(value[0], nestedClassName));
      }
    });

    classCode += `  end\n`;
    classCode += `end\n\n`;

    return nestedClasses.join('') + classCode;
  };

  return generateClass(obj);
};

// 生成Pike类
export const generatePikeClass = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getPikeType = (value: IAnyObj): string => {
    if (value === null) return 'mixed';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return 'int';
      case 'boolean': return 'bool';
      default: return 'mixed';
    }
  };

  const generateClass = (obj: IAnyObj, className: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateClass(obj[0], className);
      }
      return '';
    }

    let classCode = `class ${capitalize(className)}\n{\n`;
    const properties: string[] = [];
    const nestedClasses: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      const propertyType = getPikeType(value as IAnyObj);

      properties.push(`  ${propertyType} ${propertyName};`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedClasses.push(generateClass(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedClassName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedClasses.push(generateClass(value[0], nestedClassName));
      }
    });

    classCode += properties.join('\n') + '\n\n';
    classCode += `  void create(mixed data)\n  {\n`;

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      classCode += `    ${propertyName} = data->${key};\n`;
    });

    classCode += `  }\n`;
    classCode += `}\n\n`;

    return nestedClasses.join('') + classCode;
  };

  return generateClass(obj);
};

// 生成Haskell数据类型
export const generateHaskellType = (obj: IAnyObj): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getHaskellType = (value: IAnyObj): string => {
    if (value === null) return 'Maybe a';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[a]';
      return `[${getHaskellType(value[0])}]`;
    }
    if (typeof value === 'object') return capitalize(Object.keys(value)[0] || 'Object');
    switch (typeof value) {
      case 'string': return 'String';
      case 'number': return Number.isInteger(value) ? 'Int' : 'Double';
      case 'boolean': return 'Bool';
      default: return 'a';
    }
  };

  const generateType = (obj: IAnyObj, typeName: string = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        return generateType(obj[0], typeName);
      }
      return '';
    }

    let dataTypeCode = `data ${capitalize(typeName)} = ${capitalize(typeName)}\n`;
    const fields: string[] = [];
    const nestedTypes: string[] = [];

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const propertyName = capitalize(key.replace(/[^a-zA-Z0-9_]/g, '_'));
      const propertyType = getHaskellType(value as IAnyObj);

      fields.push(`  { ${propertyName} :: ${propertyType} }`);

      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (Object.keys(value).length > 0) {
          nestedTypes.push(generateType(value as IAnyObj, key));
        }
      }
      // 处理对象数组
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const nestedTypeName = key.endsWith('s') ? key.slice(0, -1) : key;
        nestedTypes.push(generateType(value[0], nestedTypeName));
      }
    });

    dataTypeCode += fields.join('\n') + '\n  deriving (Show)\n\n';

    return nestedTypes.join('') + dataTypeCode;
  };

  return generateType(obj);
};
