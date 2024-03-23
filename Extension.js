class CodeTokenizer {
  getInfo() {
    return {
      id: 'mpltokenizer',
      name: 'Mpl Tokenizer',
      color1: '#3db8ff',
      color2: '#1786c5',
      blocks: [
        {
          opcode: 'tokenizeCode',
          blockType: 'reporter',
          text: 'Tokenize [code]',
          arguments: {
            code: {
              type: 'string',
              defaultValue: "// Console.write(\"hello\")\n// Echo(\"Hello\")\n// Echo \"Hello\"\n// New immutable \"Variable\" = 10\n// New Array \"Array\" = [\"Hi\"]\n// New Json \"Json\" = (I didn't have time to make json for here)"
            }
          }
        }
      ]
    };
  }

  tokenizeCode(args) {
    const code = args.code.trim();
    const tokens = [];
    const lines = code.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine[0] !== '/' && !trimmedLine.startsWith('If ')) {
        const variablePattern = /^New\s+(immutable|mutable)?\s+"([^"]+)"\s*=\s*(.*)/;
        const variableMatch = trimmedLine.match(variablePattern);
        if (variableMatch) {
          const type = variableMatch[1] || 'immutable';
          const name = variableMatch[2];
          const value = variableMatch[3].trim();
          tokens.push({ command: 'New', type, name, value });
        } else {
          const statementPattern = /(\w+)\s*{([^}]+)}\s+then\s+do\s+\[([\s\S]+)\]/;
          const statementMatch = trimmedLine.match(statementPattern);
          if (statementMatch) {
            const statement = statementMatch[1];
            const condition = statementMatch[2];
            const codeBlock = statementMatch[3].trim();
            tokens.push({ statement, condition, codeBlock });
          } else {
            const commandPattern = /(\w+)\s*(\.[\w]+)?\s*\("([^"]+)"\)/;
            const commandMatch = trimmedLine.match(commandPattern);
            if (commandMatch) {
              const object = commandMatch[2] ? commandMatch[1] : '';
              const command = commandMatch[2] ? commandMatch[2].substr(1) : commandMatch[1];
              const input = commandMatch[3];
              tokens.push({ command, input, object });
            }
          }
        }
      }
    });

    return JSON.stringify(tokens);
  }
}

Scratch.extensions.register(new CodeTokenizer());
