var inputString = "";
var instList = "";
var filechoosen = false;
var wrong_code = false;
var Data_transfer_instructions = 0;
var ALU_instructions = 0;
var Control_Hazards = 0;
var Data_Hazards = 0;
var Branch_mispredictions = 0;
var Total_stalls = 0;
var Data_hazards_stalls = 0;
var Control_hazards_stalls = 0;



// File Chooser: stores contents of file in a a global variable inputString

function inputStringParser() {
  let parsedString = "";
  let lines = inputString.split("\n");
  let lineNo = 0;
  for (let i = 0; i < lines.length; i++) {
    let words = lines[i].replace("0x").split(" ");
    if (words.length > 1) {
      parsedString += `${words[0]} ${words[1]}\n`;
    } else if (words.length == 1) {
      let lineNoHex = lineNo.toString(16);
      parsedString += `${lineNoHex} ${words[0]}\n`;
      lineNo += 4;
    }
  }
  inputString = parsedString.trim();

  instList = inputString.split("\n");
  instList.pop();
  // console.log(instList);
  // console.log(instList.length);
}

function decode2(a) {
  a = a.toUpperCase();
  function toint(a) {
    let l = a.length;
    let ans = 0;
    let m = 1;
    for (let i = l - 1; i >= 0; i--) {
      if (a[i] == "1") {
        ans = ans + m;
      }
      m = m * 2;
    }

    return ans;
  }
  function negative(a) {
    let m = 1;
    let ans = 0;
    for (let i = a.length - 1; i > 0; i--) {
      if (a[i] == "1") {
        ans += m;
      }
      m *= 2;
    }
    ans -= m;
    return ans;
  }
  function tobin(a) {
    let s = "";
    if (a == "0") {
      a = 0;
    }
    if (a == "1") {
      a = 1;
    }
    if (a == "2") {
      a = 2;
    }
    if (a == "3") {
      a = 3;
    }
    if (a == "4") {
      a = 4;
    }
    if (a == "5") {
      a = 5;
    }
    if (a == "6") {
      a = 6;
    }
    if (a == "7") {
      a = 7;
    }
    if (a == "8") {
      a = 8;
    }
    if (a == "9") {
      a = 9;
    }
    if (a == "A") {
      a = 10;
    }
    if (a == "B") {
      a = 11;
    }
    if (a == "C") {
      a = 12;
    }
    if (a == "D") {
      a = 13;
    }
    if (a == "E") {
      a = 14;
    }
    if (a == "F") {
      a = 15;
    }

    for (let i = 0; i < 4; i++) {
      let x = a % 2;
      // x.toString();
      s = s + x;
      a = Math.floor(a / 2);
    }
    // reverse(s);
    let s2 = "";
    let l = s.length;
    for (let i = 0; i < l; i++) {
      s2 = s[i] + s2;
    }
    return s2;
  }
  let s = "";
  let l = a.length;
  for (let i = 0; i < l; i++) {
    let s1 = tobin(a[i]);
    s = s + s1;
  }
  let opcode = "";
  for (let i = 25; i < 32; i++) {
    opcode = opcode + s[i];
  }

  if (opcode == "0110011") {
    let ret = { op: "", rd: 0, rs1: 0, rs2: 0, imm: 0 };
    let r = "";
    for (let i = 20; i < 25; i++) {
      r = r + s[i];
    }
    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let r1 = "";
    for (let i = 12; i < 17; i++) {
      r1 = r1 + s[i];
    }
    let r2 = "";
    for (let i = 7; i < 12; i++) {
      r2 = r2 + s[i];
    }

    let fun7 = "";
    for (let i = 0; i < 7; i++) {
      fun7 = fun7 + s[i];
    }
    ret.rs1 = toint(r1);
    ret.rs2 = toint(r2);
    ret.rd = toint(r);
    if (fun3 == "000" && fun7 == "0000000") {
      ret.op = "add";
    } else if (fun3 == "000" && fun7 == "0100000") {
      ret.op = "sub";
    } else if (fun3 == "100" && fun7 == "0000000") {
      ret.op = "xor";
    } else if (fun3 == "110" && fun7 == "0000000") {
      ret.op = "or";
    } else if (fun3 == "111" && fun7 == "0000000") {
      ret.op = "and";
    } else if (fun3 == "001" && fun7 == "0000000") {
      ret.op = "sll";
    } else if (fun3 == "101" && fun7 == "0000000") {
      ret.op = "srl";
    } else if (fun3 == "101" && fun7 == "0100000") {
      ret.op = "sra";
    } else if (fun3 == "010" && fun7 == "0000000") {
      ret.op = "slt";
    } else if (fun3 == "011" && fun7 == "0000000") {
      ret.op = "sltu";
    }

    return ret;
  } else if (opcode == "0010011") {
    let ret = { op: 0, rd: 0, rs1: 0, imm: 0, rs2: 0 };
    let r = "";
    for (let i = 20; i < 25; i++) {
      r = r + s[i];
    }
    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let r1 = "";
    for (let i = 12; i < 17; i++) {
      r1 = r1 + s[i];
    }

    let imm = "";
    for (let i = 0; i < 12; i++) {
      imm = imm + s[i];
    }

    let fun7 = "";
    for (let i = 0; i < 7; i++) {
      fun7 += imm[i];
    }

    ret.rs1 = toint(r1);
    ret.rd = toint(r);
    if (imm[0] == 1) {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (fun3 == "000") {
      ret.op = "add";
    } else if (fun3 == "100") {
      ret.op = "xor";
    } else if (fun3 == "110") {
      ret.op = "or";
    } else if (fun3 == "111") {
      ret.op = "and";
    } else if (fun3 == "001" && fun7 == "0000000") {
      ret.op = "sll";
    } else if (fun3 == "101" && fun7 == "0000000") {
      ret.op = "srl";
    } else if (fun3 == "101" && fun7 == "0100000") {
      ret.op = "sra";
    } else if (fun3 == "010") {
      ret.op = "slt";
    } else if (fun3 == "011") {
      ret.op = "sltu";
    }
    ret.op = ret.op + "i";

    return ret;
  } else if (opcode == "0000011") {
    let ret = { op: "", rd: 0, rs1: 0, imm: 0, rs2: 0 };
    let r = "";
    for (let i = 20; i < 25; i++) {
      r = r + s[i];
    }
    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let r1 = "";
    for (let i = 12; i < 17; i++) {
      r1 = r1 + s[i];
    }

    let imm = "";
    for (let i = 0; i < 12; i++) {
      imm = imm + s[i];
    }

    ret.rs1 = toint(r1);
    ret.rd = toint(r);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (fun3 == "000") {
      ret.op = "lb";
    } else if (fun3 == "001") {
      ret.op = "lh";
    } else if (fun3 == "010") {
      ret.op = "lw";
    } else if (fun3 == "100") {
      ret.op = "lbu";
    } else if (fun3 == "101") {
      ret.op = "lhu";
    }
    return ret;
  } else if (opcode == "0100011") {
    let ret = { op: "", rs1: 0, rs2: 0, imm: 0, rd: 0 };
    let imm = "";
    for (let i = 0; i < 7; i++) {
      imm = imm + s[i];
    }
    for (let i = 20; i < 25; i++) {
      imm = imm + s[i];
    }
    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let rs1 = "";
    for (let i = 12; i < 17; i++) {
      rs1 = rs1 + s[i];
    }

    let rs2 = "";
    for (let i = 7; i < 12; i++) {
      rs2 = rs2 + s[i];
    }

    ret.rs1 = toint(rs1);
    ret.rs2 = toint(rs2);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (fun3 == "000") {
      ret.op = "sb";
    } else if (fun3 == "001") {
      ret.op = "sh";
    } else if (fun3 == "010") {
      ret.op = "sw";
    }

    return ret;
  } else if (opcode == "1100011") {
    let ret = { op: "", rs1: 0, rs2: 0, imm: 0, rd: 0 };
    let imm = "";
    imm = imm + s[0];
    imm = imm + s[24];

    for (let i = 1; i < 7; i++) {
      imm = imm + s[i];
    }
    for (let i = 20; i < 24; i++) {
      imm = imm + s[i];
    }

    imm += "0";

    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let rs1 = "";
    for (let i = 12; i < 17; i++) {
      rs1 = rs1 + s[i];
    }

    let rs2 = "";
    for (let i = 7; i < 12; i++) {
      rs2 = rs2 + s[i];
    }

    ret.rs1 = toint(rs1);
    ret.rs2 = toint(rs2);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (fun3 == "000") {
      ret.op = "beq";
    } else if (fun3 == "001") {
      ret.op = "bne";
    } else if (fun3 == "100") {
      ret.op = "blt";
    } else if (fun3 == "101") {
      ret.op = "bge";
    } else if (fun3 == "110") {
      ret.op = "bltu";
    } else if (fun3 == "111") {
      ret.op = "bgeu";
    }

    return ret;
  } else if (opcode == "0110111" || opcode == "0010111") {
    let ret = { op: 0, rd: 0, imm: 0, rs1: 0, rs2: 0 };
    let rd = "";
    for (let i = 20; i < 25; i++) {
      rd = rd + s[i];
    }

    let imm = "";
    for (let i = 0; i < 20; i++) {
      imm = imm + s[i];
    }

    ret.rd = toint(rd);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (opcode == "0010111") {
      ret.op = "auipc";
    } else {
      ret.op = "lui";
    }

    return ret;
  } else if (opcode == "1101111") {
    let ret = { op: "", rd: 0, imm: 0, rs1: 0, rs2: 0 };
    let rd = "";
    for (let i = 20; i < 25; i++) {
      rd = rd + s[i];
    }

    let imm = "";
    imm = imm + s[0];
    for (let i = 12; i < 20; i++) {
      imm = imm + s[i];
    }
    imm = imm + s[11];
    for (let i = 1; i < 11; i++) {
      imm = imm + s[i];
    }
    imm += "0";

    ret.rd = toint(rd);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }
    ret.op = "jal";

    return ret;
  } else if (opcode == "1100111") {
    let ret = { op: "", rd: 0, rs1: 0, imm: 0, rd: 0 };
    let r = "";
    for (let i = 20; i < 25; i++) {
      r = r + s[i];
    }

    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let r1 = "";
    for (let i = 12; i < 17; i++) {
      r1 = r1 + s[i];
    }

    let imm = "";
    for (let i = 0; i < 12; i++) {
      imm = imm + s[i];
    }

    let fun7 = "";
    for (let i = 0; i < 7; i++) {
      fun7 += imm[i];
    }

    ret.rs1 = toint(r1);
    ret.rd = toint(r);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }

    if (fun3 == "000") {
      ret.op = "jalr";
    }

    return ret;
  } else if (opcode == "1110011") {
    let ret = { op: "", rd: 0, rs1: 0, imm: 0, rs2: 0 };
    let r = "";
    for (let i = 20; i < 25; i++) {
      r = r + s[i];
    }

    let fun3 = "";

    for (let i = 17; i < 20; i++) {
      fun3 = fun3 + s[i];
    }

    let r1 = "";
    for (let i = 12; i < 17; i++) {
      r1 = r1 + s[i];
    }

    let imm = "";
    for (let i = 0; i < 12; i++) {
      imm = imm + s[i];
    }

    let fun7 = "";
    for (let i = 0; i < 7; i++) {
      fun7 += imm[i];
    }

    ret.rs1 = toint(r1);
    ret.rd = toint(r);
    if (imm[0] == "1") {
      ret.imm = negative(imm);
    } else {
      ret.imm = toint(imm);
    }
    imm = toint(imm);
    if ((fun3 = "000")) {
      if (imm == 0) {
        ret.op = "ecall";
      } else if (imm == 1) {
        ret.op = "ebreak";
      }
    }

    return ret;
  } else {
    let ret = { op: "error", rs1: 0, rs2: 0, rd: 0, imm: 0 };
    return ret;
  }
}
function print_ins(obj) {
  let op = obj.op;
  if (
    op == "add" ||
    op == "sub" ||
    op == "xor" ||
    op == "or" ||
    op == "and" ||
    op == "sll" ||
    op == "srl" ||
    op == "sra" ||
    op == "slt" ||
    op == "sltu"
  ) {
    let s =
      obj.op + " " + "x" + obj.rd + " " + "x" + obj.rs1 + " " + "x" + obj.rs2;
    return s;
  }
  if (
    op == "addi" ||
    op == "xori" ||
    op == "ori" ||
    op == "andi" ||
    op == "slli" ||
    op == "srli" ||
    op == "srai" ||
    op == "slti" ||
    op == "sltiu"
  ) {
    let s = obj.op + " " + "x" + obj.rd + " " + "x" + obj.rs1 + " " + obj.imm;
    return s;
  }
  if (op == "lb" || op == "lh" || op == "lw" || op == "lbu" || op == "lhu") {
    let s = obj.op + " " + "x" + obj.rd + " " + obj.imm + "(x" + obj.rs1 + ")";
    return s;
  }
  if (op == "sb" || op == "sh" || op == "sw") {
    let s = obj.op + " " + "x" + obj.rs2 + " " + obj.imm + "(x" + obj.rs1 + ")";
    return s;
  }
  if (
    op == "beq" ||
    op == "bne" ||
    op == "blt" ||
    op == "bge" ||
    op == "bltu" ||
    op == "bgeu"
  ) {
    let s = obj.op + " " + "x" + obj.rs1 + " " + "x" + obj.rs2 + " " + obj.imm;
    return s;
  }

  if (op == "jal" || op == "jalr") {
    let s = obj.op + " x" + obj.rd + " " + obj.imm;
    return s;
  }
  if (op == "lui" || op == "auipc") {
    let s = obj.op + " x" + obj.rd + " " + obj.imm;
    return s;
  }
  if (op == "ecall" || op == "ebreak") {
    let s = op;
    return s;
  }
}

function cycles(op) {
  let operations = new Array(5);
  operations.fill(1);
  operations[3] = 0;
  if (
    op === "lw" ||
    op === "lh" ||
    op === "lb" ||
    op === "lhu" ||
    op === "lbu" ||
    op === "sh" ||
    op === "sw" ||
    op === "sb"
  )
    operations[3] = 1;
  if (op === "sb" || op === "sw" || op === "sh" || op[0] === "b")
    operations[4] = 0;
  return operations;
}

function RFSync(rf, format) {
  switch (format) {
    case "hex":
      document.querySelector(".dropbtn").textContent = "Hexadecimal";
      break;
    case "dec":
      document.querySelector(".dropbtn").textContent = "Decimal";
      break;
    case "udec":
      document.querySelector(".dropbtn").textContent = "Unsigned Decimal";
  }

  let registerFile = document.querySelectorAll(".register-value");
  for (let i = 1; i < registerFile.length; i++) {
    let value = rf[i - 1];
    value = value < 0 ? value + (0xffffffff + 1) : value;
    if (format === "hex") value = value.toString(16);
    else if (format === "dec") value &= 0xffffffff;
    registerFile[i].textContent = `${format === "hex" ? "0x" : ""}${value}`;
  }
}

function timelineAppendRow(cycle, row) {
  // cycle is value of current cycle number
  // row is an array of size 5 containing 5 numbers which represent the instruction number being executed
  // row value 0 means stall
  cycleDiv = document.createElement("div");
  cycleDiv.className = "timeline-cell";
  cycleDiv.innerHTML = cycle;
  document.getElementById("cycle").appendChild(cycleDiv);

  let timelineHeaderId = [
    "fetch",
    "decode",
    "execute",
    "memoryaccess",
    "writeback",
  ];
  for (let i = 0; i < row.length; i++) {
    let timelineCellDiv = document.createElement("div");
    timelineCellDiv.className = "timeline-cell";
    if (row[i] != 0) {
      timelineCellDiv.innerHTML = row[i];
    } else {
      let stallDiv = document.createElement("div");
      stallDiv.className = "stall";
      timelineCellDiv.appendChild(stallDiv);
    }
    document.getElementById(timelineHeaderId[i]).appendChild(timelineCellDiv);
  }
}
// for (let i = 1; i < 3; i++) {
//     timelineAppendRow(i, [i, i, (i%7!=0)+i, (i%7==0)+i, i&1]);
// }
function register_update(register_file) {
  let type = document.getElementsByClassName("dropbtn")[0].innerText;
  for (let i = 1; i < 32; i++) {
    if (type == "Hexadecimal") {
      document.getElementById("register-x" + i).innerText =
        "0x" + register_file[i].toString(16);
    } else if (type == "Decimal") {
      document.getElementById("register-x" + i).innerText = register_file[i];
    } else if (type == "Unsigned") {
      if (register_file[i] < 0) register_file[i] = register_file[i];
      document.getElementById("register-x" + i).innerText = register_file[i];
    }
  }
}
// var cnt = 1;
// var intervalId = setInterval(() => {
//   let i = cnt;

//   timelineAppendRow(i, [i, i, (i%7!=0)+i, (i%7==0)+i, i&1]);
//   cnt++;
//   if (cnt == 1) {  // rows to generate
//     clearInterval(intervalId);
//   }
// }, 0);  // time in milisec

class Simulator {
  constructor() {
    this.DONE = 0;
    this.CYCLE = 0; // Cycle number
    this.PC = 0; // Program counter
    this.INSTRUCTION = ""; // Stores current instruction from Fetch
    this.RF = new Array(32); // Register file
    this.RF.fill(0);
    this.OP = ""; // Stores operator decoded from Decode
    this.RS1 = 0; // 0 to 31 for each register
    this.RS2 = 0; // 0 to 31 for each register
    this.RD = 0; // 0 to 31 for each register
    this.IMM = 0; // Stores immediate value
    this.ALURESULT = 0; // Stores result of ALU or Memory value
    this.MEMORY = {};
    this.RF[2] = 2147483632;
    this.pc = new Array(5);
    this.pc.fill(-1);
    // Now creating Instruction div elements
    for (let i = 0; i < instList.length; i++) {
      // console.log(i);
      let pc_inst = instList[i].split(" ")[0].replace("0x", "");
      let a_inst = instList[i].split(" ")[1].replace("0x", "");
      let instructionDiv = document.createElement("div");
      instructionDiv.className = "instruction-row";
      instructionDiv.innerHTML = `<div class="instruction-addr">0x${pc_inst}</div>
            <div class="instruction-hex">0x${a_inst}</div>
            <div class="instruction-decoded" id="instruction-rowd-${i}">---</div>`;
      document
        .getElementsByClassName("instructions")[0]
        .appendChild(instructionDiv);
    }

    // Now creating Timeline div elements

    // Now creating register div elements
    document
      .getElementById("register")
      .getElementsByClassName("register-container")[0].innerHTML = "";
    for (let i = 0; i < 32; i++) {
      let registerDiv = document.createElement("div");
      registerDiv.className = "register-row";
      registerDiv.innerHTML = `<div class="register-name">x${i}</div>
          <div class="register-value" id="register-x${i}">${this.RF[i]}</div>`;
      document
        .getElementById("register")
        .getElementsByClassName("register-container")[0]
        .appendChild(registerDiv);
    }

    // Now creating memory div elements
    document
      .getElementById("memory")
      .getElementsByClassName("memory-container")[0].innerHTML = "";
    for (let i = 0; i < 10; i++) {
      let memoryDiv = document.createElement("div");
      memoryDiv.className = "memory-row";
      memoryDiv.id = `memory-row-${i}`;
      memoryDiv.innerHTML = `<div class="memory-address"></div>
          <div class="memory-value">
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
          </div>`;
      document
        .getElementById("memory")
        .getElementsByClassName("memory-container")[0]
        .appendChild(memoryDiv);
    }

    document.querySelector("#but-hex").addEventListener("click", function () {
      RFSync(simulator.RF, "hex");
      memSync(simulator.MEMORY, "hex");
    });
    document.querySelector("#but-dec").addEventListener("click", function () {
      RFSync(simulator.RF, "dec");
      memSync(simulator.MEMORY, "dec");
    });
    document.querySelector("#but-udec").addEventListener("click", function () {
      RFSync(simulator.RF, "udec");
      memSync(simulator.MEMORY, "udec");
    });
  }


  step() {
    this.fetch();
    if (this.DONE) return;
    this.decode();
    let oper = new Array(5);
    if (this.OP == "error") {
      alert("!Wrong code.");
      wrong_code = true;
      location.reload();
    }
    oper = cycles(this.OP);
    let obj2 = decode2(this.INSTRUCTION);
    let ins_to_print = print_ins(obj2);
    document.getElementById("instruction-rowd-" + this.PC).innerText =
      ins_to_print;
    for (let i = 0; i < oper.length; i++) oper[i] *= this.PC + 1;
    timelineAppendRow(this.CYCLE + 1, oper);
    this.execute();
    if (oper[3] != 0) this.memoryAccess();
    if (oper[4] != 0) this.writeBack();
    let type = document.getElementsByClassName("dropbtn")[0].innerText;
    console.log(type);
    let numberFormat = "hex";
    if (type === "Unsigned Decimal") numberFormat = "udec";
    if (type === "Decimal") numberFormat = "dec";
    RFSync(this.RF, numberFormat);
    this.CYCLE += 1;
    document.querySelector(".cycle-count").innerHTML = this.CYCLE;
    if (this.CYCLE > 10000) {
      wrong_code = true;
      alert("Infinite loop");
      location.reload();
    }
  }





  fetch() {
    if (this.PC >= instList.length) {
      this.DONE = 1;
    }
    if (!this.DONE) {
      this.INSTRUCTION = instList[this.PC].split(" ")[1];
    }
  }
  decode() {
    let obj = decode2(this.INSTRUCTION);
    console.log(obj);
    this.IMM = obj.imm;
    this.OP = obj.op;
    this.RS1 = obj.rs1;
    this.RS2 = obj.rs2;
    this.RD = obj.rd;
  }
    execute() {
    let rs1 = Math.round(this.RF[Math.round(this.RS1)]);
    let rs2 = Math.round(this.RF[Math.round(this.RS2)]);
    let imm = Math.round(this.IMM);
    switch (this.OP) {
      case "add":
        this.ALURESULT = rs1 + rs2;
        break;
      case "sub":
        this.ALURESULT = rs1 - rs2;
        break;
      case "xor":
        this.ALURESULT = rs1 ^ rs2;
        break;
      case "or":
        this.ALURESULT = rs1 | rs2;
        break;
      case "and":
        this.ALURESULT = rs1 & rs2;
        break;
      case "sll":
        this.ALURESULT = rs1 << rs2;
        break;
      case "srl":
        this.ALURESULT = rs1 >>> rs2;
        break;
      case "sra":
        this.ALURESULT = rs1 >> rs2;
        break;
      case "slt":
        this.ALURESULT = rs1 < rs2 ? 1 : 0;
        break;
      case "sltu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 < rs2) this.ALURESULT = 1;
        else this.ALURESULT = 0;
        break;
      case "addi":
        this.ALURESULT = rs1 + imm;
        break;
      case "xori":
        this.ALURESULT = rs1 ^ imm;
        break;
      case "ori":
        this.ALURESULT = rs1 | imm;
        break;
      case "andi":
        this.ALURESULT = rs1 & imm;
        break;
      case "slli":
        this.ALURESULT = rs1 << imm;
        break;
      case "srli":
        this.ALURESULT = rs1 >> imm;
        break;
      case "srai":
        this.ALURESULT = rs1 >> imm;
        break;
      case "slti":
        this.ALURESULT = rs1 < imm ? 1 : 0;
        break;
      case "sltiu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        imm = imm < 0 ? 0xffffffff - 1 - imm : imm;
        if (rs1 < imm) this.ALURESULT = 1;
        else this.ALURESULT = 0;
        break;
      case "lb":
      case "lh":
      case "lw":
      case "lbu":
      case "lhu":
      case "sb":
      case "sh":
      case "sw":
        this.ALURESULT = rs1 + imm;
        break;
      case "beq":
        if (rs1 == rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "bne":
        if (rs1 != rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "blt":
        if (rs1 < rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "bge":
        if (rs1 >= rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "bltu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 < rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "bgeu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 >= rs2) this.PC += imm >> 2;
        else this.PC += 1;
        break;
      case "jal":
        this.ALURESULT = 4 * (this.PC + 1);
        this.PC += imm >> 2;
        break;
      case "jalr":
        this.ALURESULT = 4 * (this.PC + 1);
        this.PC = (rs1 >> 2) + (imm >> 2);
        break;
      case "lui":
        this.ALURESULT = imm << 12;
        break;
      case "auipc":
        this.ALURESULT = 4 * this.PC + (imm << 12);
        break;
      default:
        console.error("Error");
        break;
    }
    if (this.OP[0] != "b" && this.OP[0] != "j") this.PC += 1;
    console.log(this.ALURESULT);
  }

  memoryAccess() {
    function numberToHexString(number) {
      let hexString = (
        number < 0 ? number + (0xffffffff + 1) : number
      ).toString(16);
      while (hexString.length < 8) hexString = "0" + hexString;
      return hexString;
    }
    let address = this.ALURESULT;
    if (this.OP[0] === "s") {
      let hexNum = numberToHexString(this.RF[this.RS2]);
      this.MEMORY[address] = hexNum[6] + hexNum[7];
      switch (this.OP[1]) {
        case "w":
          this.MEMORY[address + 2] = hexNum[2] + hexNum[3];
          this.MEMORY[address + 3] = hexNum[0] + hexNum[1];
        case "h":
          this.MEMORY[address + 1] = hexNum[4] + hexNum[5];
      }
      console.log(
        this.MEMORY[address] +
          this.MEMORY[address + 1] +
          this.MEMORY[address + 2] +
          this.MEMORY[address + 3]
      );
      let type = document.getElementsByClassName("dropbtn")[0].innerText;
      let numberFormat = "hex";
      if (type === "Unsigned Decimal") numberFormat = "udec";
      if (type === "Decimal") numberFormat = "dec";
      memSync(this.MEMORY, numberFormat);
    } else if (this.OP[0] === "l") {
      let hexNum = "";
      switch (this.OP[1]) {
        case "w":
          hexNum +=
            (this.MEMORY[address + 3] === undefined
              ? "00"
              : this.MEMORY[address + 3]) +
            (this.MEMORY[address + 2] === undefined
              ? "00"
              : this.MEMORY[address + 2]);
        case "h":
          hexNum +=
            this.MEMORY[address + 1] === undefined
              ? "00"
              : this.MEMORY[address + 1];
        default:
          hexNum +=
            this.MEMORY[address] === undefined ? "00" : this.MEMORY[address];
      }
      let decimalNumber = parseInt(hexNum, 16);
      if (this.OP[2] == "u") {
        switch (this.OP[1]) {
          case "b":
            if (decimalNumber & 0x80) decimalNumber -= 0xff + 1;
          case "h":
            if (decimalNumber & 0x8000) decimalNumber -= 0xffff + 1;
          case "w":
            if (decimalNumber & 0x80000000) decimalNumber -= 0xffffffff + 1;
        }
      }
      this.ALURESULT = decimalNumber;
    }
  }

  writeBack() {
    if (Number(this.RD) !== 0) this.RF[this.RD] = this.ALURESULT;
  }
}

var simulator = new Simulator();
RFSync(simulator.RF, "hex");

document.querySelector(".step").addEventListener("click", () => {
  if (wrong_code) {
  } else if (filechoosen) {
    simulator.step();
  } else {
    alert("!Please choose a file");
  }
});
document.querySelector(".run").addEventListener("click", () => {
  let time_delay = 500 - 5 * document.querySelector("#speed").value;
  if (filechoosen) {
    let currentInterval = setInterval(function () {
      if (wrong_code) {
      }
      simulator.step();
      if (simulator.DONE) {
        clearInterval(currentInterval);
      }
    }, time_delay);
  } else {
    alert("!Please choose a file");
  }
});
document.querySelector(".reset").addEventListener("click", () => {
  location.reload(true);
});

document
  .querySelector("#thefile")
  .addEventListener("change", async function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      inputString = e.target.result;
      console.log(inputString);

      inputStringParser();
      // console.log(inputString);
      filechoosen = true;
      // Creating new simulator object.
      simulator = new Simulator();
      RFSync(simulator.RF, "hex");
      // for(let inst of instList){
      //   let act_inst = inst.split(' ')[1].replace('0x', '');
      //   console.log(inst);
      //   simulator.INSTRUCTION = act_inst;
      //   console.log("HELLOWMODOWE");
      //   // console.log(simulator.decode());
      //   simulator.step();
      // }
    };
    reader.readAsText(file);
  });

let rowsCreated = 10;
function addRow() {
  // document.getElementById("memory").getElementsByClassName("memory-container")[0].innerHTML = "";
  let memoryDiv = document.createElement("div");
  memoryDiv.className = "memory-row";
  memoryDiv.id = `memory-row-${rowsCreated}`;
  memoryDiv.innerHTML = `<div class="memory-address"></div>
    <div class="memory-value">
        <div class="memory-cell"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell"></div>
    </div>`;
  document
    .getElementById("memory")
    .getElementsByClassName("memory-container")[0]
    .appendChild(memoryDiv);
}

function memSync(memory, format) {
  function numberToHexString(number) {
    let hexString = (number < 0 ? number + (0xffffffff + 1) : number).toString(
      16
    );
    while (hexString.length < 8) hexString = "0" + hexString;
    return hexString;
  }
  let lastAccess = -1;
  let memoryLocations = document.querySelectorAll(".memory-cell");
  let rowWritten = 0;
  for (let address in memory) {
    let value = memory[address];
    if (format[0] !== "h") value = parseInt(value, 16);
    if (format[0] === "u" && value & 0x80) value -= 0xff + 1;

    if (address >> 2 === lastAccess) {
      memoryLocations[4 * rowWritten + (address % 4)].textContent = value;
    } else {
      lastAccess = address >> 2;
      if (rowsCreated - rowWritten < 2) {
        addRow();
        rowsCreated++;
      }
      rowWritten++;
      for (let i = 0; i < 4; i++)
        if (memoryLocations[4 * rowWritten + i].textContent === "")
          memoryLocations[4 * rowWritten + i].textContent =
            format === "hex" ? "00" : "0";
      let memoryAddress = document.querySelectorAll(".memory-address");
      memoryAddress[rowWritten].textContent =
        "0x" + numberToHexString(address - (address % 4));
      memoryLocations[4 * rowWritten + (address % 4)].textContent = value;
    }
  }
}































class PipelineSimulator {
  constructor() {
    this.DONE = 0;
    this.CYCLE = 0; // Cycle number
    this.PC = 0; // Program counter
    this.INSTRUCTION = ""; // Stores current instruction from Fetch
    this.RF = new Array(32); // Register file
    this.RF.fill(0);
    this.OP = new Array(instList.length); // Stores operator decoded from Decode
    this.RS1 = new Array(instList.length); // 0 to 31 for each register
    this.RS2 = new Array(instList.length); // 0 to 31 for each register
    this.RD = new Array(instList.length);// 0 to 31 for each register
    this.IMM = new Array(instList.length); // Stores immediate value
    this.ALURESULT = new Array(instList.length); // Stores result of ALU or Memory value
    this.MEMORY = {};
    this.RF[2] = 2147483632;
    this.pc = new Array(5);
    this.pc.fill(-1);
    this.pc[0] = 0;
    this.BTB(instList.length);
    for(let i = 0; i<instList.length; i++){
      this.BTB[i] = i+1;
    }
    
    



    // Now creating Instruction div elements
    for (let i = 0; i < instList.length; i++) {
      // console.log(i);
      let pc_inst = instList[i].split(" ")[0].replace("0x", "");
      let a_inst = instList[i].split(" ")[1].replace("0x", "");
      let instructionDiv = document.createElement("div");
      instructionDiv.className = "instruction-row";
      instructionDiv.innerHTML = `<div class="instruction-addr">0x${pc_inst}</div>
            <div class="instruction-hex">0x${a_inst}</div>
            <div class="instruction-decoded" id="instruction-rowd-${i}">---</div>`;
      document
        .getElementsByClassName("instructions")[0]
        .appendChild(instructionDiv);
    }

    // Now creating Timeline div elements

    // Now creating register div elements
    document
      .getElementById("register")
      .getElementsByClassName("register-container")[0].innerHTML = "";
    for (let i = 0; i < 32; i++) {
      let registerDiv = document.createElement("div");
      registerDiv.className = "register-row";
      registerDiv.innerHTML = `<div class="register-name">x${i}</div>
          <div class="register-value" id="register-x${i}">${this.RF[i]}</div>`;
      document
        .getElementById("register")
        .getElementsByClassName("register-container")[0]
        .appendChild(registerDiv);
    }

    // Now creating memory div elements
    document
      .getElementById("memory")
      .getElementsByClassName("memory-container")[0].innerHTML = "";
    for (let i = 0; i < 10; i++) {
      let memoryDiv = document.createElement("div");
      memoryDiv.className = "memory-row";
      memoryDiv.id = `memory-row-${i}`;
      memoryDiv.innerHTML = `<div class="memory-address"></div>
          <div class="memory-value">
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
              <div class="memory-cell"></div>
          </div>`;
      document
        .getElementById("memory")
        .getElementsByClassName("memory-container")[0]
        .appendChild(memoryDiv);
    }

    document.querySelector("#but-hex").addEventListener("click", function () {
      RFSync(simulator.RF, "hex");
      memSync(simulator.MEMORY, "hex");
    });
    document.querySelector("#but-dec").addEventListener("click", function () {
      RFSync(simulator.RF, "dec");
      memSync(simulator.MEMORY, "dec");
    });
    document.querySelector("#but-udec").addEventListener("click", function () {
      RFSync(simulator.RF, "udec");
      memSync(simulator.MEMORY, "udec");
    });
  }

  
  // step() {
  //   this.fetch();
  //   if (this.DONE) return;
  //   this.decode();
  //   let oper = new Array(5);
  //   if (this.OP == "error") {
  //     alert("!Wrong code.");
  //     wrong_code = true;
  //     location.reload();
  //   }
  //   oper = cycles(this.OP);
  //   let obj2 = decode2(this.INSTRUCTION);
  //   let ins_to_print = print_ins(obj2);
  //   document.getElementById("instruction-rowd-" + this.PC).innerText =
  //     ins_to_print;
  //   for (let i = 0; i < oper.length; i++) oper[i] *= this.PC + 1;
  //   timelineAppendRow(this.CYCLE + 1, oper);
  //   this.execute();
  //   if (oper[3] != 0) this.memoryAccess();
  //   if (oper[4] != 0) this.writeBack();
  //   let type = document.getElementsByClassName("dropbtn")[0].innerText;
  //   console.log(type);
  //   let numberFormat = "hex";
  //   if (type === "Unsigned Decimal") numberFormat = "udec";
  //   if (type === "Decimal") numberFormat = "dec";
  //   RFSync(this.RF, numberFormat);
  //   this.CYCLE += 1;
  //   document.querySelector(".cycle-count").innerHTML = this.CYCLE;
  //   if (this.CYCLE > 10000) {
  //     wrong_code = true;
  //     alert("Infinite loop");
  //     location.reload();
  //   }
  // }

  step(){
    for(let i = 4; i>=0; i--){
      if(this.pc[i] != -1) break;
      else if(i == 0  && this.DONE) return;
    }
    this.pc[4] = -1;
    if(this.pc[3] != -1 && this.pc[4] == -1){
      this.pc[4] = this.pc[3];
      this.pc[3] = -1;
      if(cycles(decode2(instList[this.pc[4]].split(" ")[1]).op)[4] != 0)
      this.writeBack();
    }
    if(this.pc[2] != -1 && this.pc[3] == -1){
      this.pc[3] = this.pc[2];
      this.pc[2] = -1;
      if(cycles(decode2(instList[this.pc[4]].split(" ")[1]).op)[3] != 0)
      this.memoryAccess();
    }
    if(this.pc[1] != -1 && this.pc[2] == -1){
      this.pc[2] = this.pc[1];
      this.pc[1] = -1;
      if(this.execute() == 1){
        this.pc[1] = -1;
        this.pc[0] = -1;
        return;
      }
    }
    if(this.pc[0] != -1 && this.pc[1] == -1){
      this.pc[1] = this.pc[0];
      this.pc[0] = -1;

      this.decode();
      if(this.OP[this.pc[1]][0] == 'b'  ||    this.OP[this.pc[1]][0] == 'j'){
        this.PC = this.BTB[this.pc[1]];
      }
    }
    if(this.DONE != 1 && this.pc[0] == -1){
      this.pc[0] = this.PC;
      this.fetch();
    }
    if(this.DONE == 1){
      this.pc[0] = -1;
    }
  }



  fetch() {
    if (this.PC >= instList.length) {
      this.DONE = 1;
    }
    if (!this.DONE) {
      this.INSTRUCTION = instList[this.PC].split(" ")[1];
      this.PC += 1;
    }
  }
  decode() {
    let obj = decode2(instList[this.pc[1]].split(" ")[1]);
    // console.log(obj);
    this.IMM[this.pc[1]] = obj.imm;
    this.OP[this.pc[1]]= obj.op;
    this.RS1[this.pc[1]] = obj.rs1;
    this.RS2[this.pc[1]] = obj.rs2;
    this.RD[this.pc[1]] = obj.rd;
  }
  execute() {
    let rs1 = Math.round(this.RF[Math.round(this.RS1[this.pc[2]])]);
    let rs2 = Math.round(this.RF[Math.round(this.RS2[this.pc[2]])]);
    let imm = Math.round(this.IMM[this.pc[2]]);
    let dum;
    let flag = 0;
    switch (this.OP) {
      case "add":
        this.ALURESULT[this.pc[2]] = rs1 + rs2;
        break;
      case "sub":
        this.ALURESULT[this.pc[2]] = rs1 - rs2;
        break;
      case "xor":
        this.ALURESULT[this.pc[2]] = rs1 ^ rs2;
        break;
      case "or":
        this.ALURESULT[this.pc[2]] = rs1 | rs2;
        break;
      case "and":
        this.ALURESULT[this.pc[2]] = rs1 & rs2;
        break;
      case "sll":
        this.ALURESULT[this.pc[2]] = rs1 << rs2;
        break;
      case "srl":
        this.ALURESULT[this.pc[2]] = rs1 >>> rs2;
        break;
      case "sra":
        this.ALURESULT[this.pc[2]] = rs1 >> rs2;
        break;
      case "slt":
        this.ALURESULT[this.pc[2]] = rs1 < rs2 ? 1 : 0;
        break;
      case "sltu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 < rs2) this.ALURESULT[this.pc[2]] = 1;
        else this.ALURESULT[this.pc[2]] = 0;
        break;
      case "addi":
        this.ALURESULT[this.pc[2]] = rs1 + imm;
        break;
      case "xori":
        this.ALURESULT[this.pc[2]] = rs1 ^ imm;
        break;
      case "ori":
        this.ALURESULT[this.pc[2]] = rs1 | imm;
        break;
      case "andi":
        this.ALURESULT[this.pc[2]] = rs1 & imm;
        break;
      case "slli":
        this.ALURESULT[this.pc[2]] = rs1 << imm;
        break;
      case "srli":
        this.ALURESULT[this.pc[2]] = rs1 >> imm;
        break;
      case "srai":
        this.ALURESULT[this.pc[2]] = rs1 >> imm;
        break;
      case "slti":
        this.ALURESULT[this.pc[2]] = rs1 < imm ? 1 : 0;
        break;
      case "sltiu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        imm = imm < 0 ? 0xffffffff - 1 - imm : imm;
        if (rs1 < imm) this.ALURESULT[this.pc[2]] = 1;
        else this.ALURESULT[this.pc[2]] = 0;
        break;
      case "lb":
      case "lh":
      case "lw":
      case "lbu":
      case "lhu":
      case "sb":
      case "sh":
      case "sw":
        this.ALURESULT[this.pc[2]] = rs1 + imm;
        break;
      case "beq":
        if (rs1 == rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "bne":
        if (rs1 != rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "blt":
        if (rs1 < rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "bge":
        if (rs1 >= rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "bltu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 < rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "bgeu":
        rs1 = rs1 < 0 ? 0xffffffff - 1 - rs1 : rs1;
        rs2 = rs2 < 0 ? 0xffffffff - 1 - rs2 : rs2;
        if (rs1 > rs2) dum = this.pc[2] + imm >> 2;
        else dum = this.pc[2] + 1;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum; 
          this.PC = dum;
        }
        return flag;
        break;
      case "jal":
        this.ALURESULT[this.pc[2]] = 4 * (this.pc[2] + 1);
        dum = this.pc[2] + imm >> 2;
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum;
          this.PC = dum;
        }
        return flag;
        break;
      case "jalr":
        this.ALURESULT[this.pc[2]] = 4 * (this.pc[2] + 1);
        dum = (rs1 >> 2) + (imm >> 2);
        if(dum == this.BTB[this.pc[2]]) flag = 1;
        else{
          this.BTB[this.pc[2]] = dum;
          this.PC = dum;
        }
        return flag;
        break;
      case "lui":
        this.ALURESULT[this.pc[2]] = imm << 12;
        break;
      case "auipc":
        this.ALURESULT[this.pc[2]] = 4 * this.PC + (imm << 12);
        break;
      default:
        console.error("Error");
        break;
    }
    if (this.OP[0] != "b" && this.OP[0] != "j") this.PC += 1;
    // console.log(this.ALURESULT[this.pc[2]]);
  }

  memoryAccess() {
    function numberToHexString(number) {
      let hexString = (
        number < 0 ? number + (0xffffffff + 1) : number
      ).toString(16);
      while (hexString.length < 8) hexString = "0" + hexString;
      return hexString;
    }
    let address = this.ALURESULT[this.pc[3]];
    if (this.OP[0] === "s") {
      let hexNum = numberToHexString(this.RF[this.RS2[this.pc[3]]]);
      this.MEMORY[address] = hexNum[6] + hexNum[7];
      switch (this.OP[this.pc[3]][1]) {
        case "w":
          this.MEMORY[address + 2] = hexNum[2] + hexNum[3];
          this.MEMORY[address + 3] = hexNum[0] + hexNum[1];
        case "h":
          this.MEMORY[address + 1] = hexNum[4] + hexNum[5];
      }
      console.log(
        this.MEMORY[address] +
          this.MEMORY[address + 1] +
          this.MEMORY[address + 2] +
          this.MEMORY[address + 3]
      );
      let type = document.getElementsByClassName("dropbtn")[0].innerText;
      let numberFormat = "hex";
      if (type === "Unsigned Decimal") numberFormat = "udec";
      if (type === "Decimal") numberFormat = "dec";
      memSync(this.MEMORY, numberFormat);
    } else if (this.OP[this.pc[3]][0] === "l") {
      let hexNum = "";
      switch (this.OP[this.pc[3]][1]) {
        case "w":
          hexNum +=
            (this.MEMORY[address + 3] === undefined
              ? "00"
              : this.MEMORY[address + 3]) +
            (this.MEMORY[address + 2] === undefined
              ? "00"
              : this.MEMORY[address + 2]);
        case "h":
          hexNum +=
            this.MEMORY[address + 1] === undefined
              ? "00"
              : this.MEMORY[address + 1];
        default:
          hexNum +=
            this.MEMORY[address] === undefined ? "00" : this.MEMORY[address];
      }
      let decimalNumber = parseInt(hexNum, 16);
      if (this.OP[this.pc[3]][2] == "u") {
        switch (this.OP[1]) {
          case "b":
            if (decimalNumber & 0x80) decimalNumber -= 0xff + 1;
          case "h":
            if (decimalNumber & 0x8000) decimalNumber -= 0xffff + 1;
          case "w":
            if (decimalNumber & 0x80000000) decimalNumber -= 0xffffffff + 1;
        }
      }
      this.ALURESULT[this.pc[3]] = decimalNumber;
    }
  }

  writeBack() {
    if (Number(this.RD[this.pc[4]]) !== 0) this.RF[this.RD[this.pc[4]]] = this.ALURESULT[this.pc[4]];
  }
}








document.getElementById("speed").addEventListener("input", function () {
  document.getElementById("speed-value").innerText = this.value;
});