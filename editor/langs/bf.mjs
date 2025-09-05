/**
 * @type {Object} BrainFuckのコードを扱うオブジェクト
 */
const BF = {

    /**
     * @type {String} デフォルト用コード
     * @description Hello,World!を出力
     */
    defaultCode: "++++++++[\n\t>++++[\n\t\t>++>+++>+++>+<<<<-\n\t]\n\t>+>+>->>+[\n\t\t<\n\t]\n\t<-\n]\n>>.\n>---.\n+++++++..\n+++.\n>>.\n<-.\n<.\n+++.\n------.\n--------.\n>>+.\n>++.\n",

    /**
     * @type {Number} メモリーの長さ
     */
    memoryLength: 65536,

    /**
     * @type {String[]} 各命令
     * @property 0.ポインタをインクリメント
     * @property 1.ポインタをデクリメント
     * @property 2.値をインクリメント
     * @property 3.値をデクリメント
     * @property 4.出力
     * @property 5.入力
     * @property 6.0ならジャンプ
     * @property 7.0でないなら戻る
     */
    commands: [
        ">",
        "<",
        "+",
        "-",
        ".",
        ",",
        "[",
        "]",
    ],

    /**
     * @type {String[]} シンタックスハイライト用の色
     * @property 0.ポインタをインクリメント
     * @property 1.ポインタをデクリメント
     * @property 2.値をインクリメント
     * @property 3.値をデクリメント
     * @property 4.出力
     * @property 5.入力
     * @property 6.0ならジャンプ
     * @property 7.0でないなら戻る
     */
    colors: [
        "#f5bc42",
        "#f5bc42",
        "#4287f5",
        "#f54242",
        "#42f575",
        "#f542d4",
        "#8a42f5",
        "#8a42f5",
    ],

    /**
     * 実行する
     * @param {String} program 実行するプログラムのコード
     * @param {String} inputText 入力テキスト
     * @return {String} 出力
     */
    exec(program, inputText) {
        let pointer = 0;
        let strIndex = 0;
        let outputText = "";

        const commands = this.commands;
        const memory = new Uint8Array(this.memoryLength);
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        const programLen = program.length;
        const encodedInput = encoder.encode(inputText);

        for (let i = 0; i < programLen; i++) {

            switch (program[i]) {
                case commands[0]:
                    pointer++;
                    break;
                case commands[1]:
                    pointer--;
                    break;
                case commands[2]:
                    memory[pointer]++;
                    break;
                case commands[3]:
                    memory[pointer]--;
                    break;
                case commands[4]:
                    outputText += decoder.decode(memory.slice(pointer, pointer + 1));
                    break;
                case commands[5]:
                    memory[pointer] = encodedInput[strIndex++];
                    break;
                case commands[6]:
                    if (!memory[pointer]) while (program[++i] != "]");
                    break;
                case commands[7]:
                    if (memory[pointer]) {
                        let depth = 0;
                        while (1) {
                            const current = program[--i];
                            if (current == "]") {
                                depth++;
                            } else if (current == "[" && !depth--) {
                                break;
                            }
                        }
                    }
                    break;
            }
        }

        return outputText;
    },

    /**
     * コードにシンタックスハイライトを適用する
     * @param {String} program プログラム
     * @return {HTMLElement[]} 適用後のhtml
     */
    applySyntax(program) {
        const commands = this.commands;
        const programLen = program.length;

        const syntaxHTML = [];
        for (let i = 0; i < programLen; i++) {

            const char = program[i];

            const commnadIndex = commands.indexOf(char);

            if (commnadIndex >= 0) {
                syntaxHTML.push(createSpan(char, this.colors[commnadIndex]));
            } else {
                if (char == "\n") {
                    syntaxHTML.push(document.createElement("br"));
                } else {
                    syntaxHTML.push(createSpan(char, "#f0f0f0"));
                }
            }
        }

        return syntaxHTML;
    }
}

export default BF;
