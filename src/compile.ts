/*
Example block format:
{
    "type": "autonomous_begin",
    "id": "J3LmHw`1;=auU]@=4u}d",
    "deletable": false,
    "next": {
        "block": {
            "type": "score",
            "id": "mcP~xql}`H*C,5?^3jyR",
            "fields": {
                "ROW": "HIGH",
                "COL": "LEFT"
            },
            "inputs": {
                "NAME": {
                    "block": {
                        "type": "game_piece",
                        "id": "LUDK2!1h[WgV)^^llvk,",
                        "fields": {
                            "GAME_PIECE": "CONE"
                        }
                    }
                }
            },
            "next": {
                "block": {
                    "type": "balance",
                    "id": "vm~TXcg^`O{v#4!2$lnz",
                    "next": {
                        "block": {
                            "type": "wait",
                            "id": "3J(L[OTj.ZvV2B.gMxi5",
                            "inputs": {
                                "NAME": {
                                    "block": {
                                        "type": "math_number",
                                        "id": "L{L2SC5c)@VZ^8;WZaGg",
                                        "fields": {
                                            "NUM": 5
                                        }
                                    }
                                }
                            },
                            "next": {
                                "block": {
                                    "type": "intake",
                                    "id": "TK{DP+[CUXHpa_mAK}f{",
                                    "fields": {
                                        "ID": "LEFT"
                                    },
                                    "inputs": {
                                        "NAME": {
                                            "block": {
                                                "type": "game_piece",
                                                "id": "*[ye,UP_4_rEp-($0t1M",
                                                "fields": {
                                                    "GAME_PIECE": "CONE"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

Example intermediate format:
[{"type":"score","row":"HIGH","col":"LEFT","gamePiece":"CONE"},{"type":"wait","time":5}]
*/

import type Blockly from "blockly";

export type NodeLevel = "low" | "mid" | "high";
export type NodeColumn = "cone_left" | "cube" | "cone_right";
export type GamePiece = "cone" | "cube";

type Command =
    | {
          type: "score";
          level: NodeLevel;
          column: NodeColumn;
          gamePiece: GamePiece;
      }
    | {
          type: "balance";
      }
    | {
          type: "wait";
          time: number;
      }
    | {
          type: "intake";
          index: string;
          gamePiece: GamePiece;
      };

export function simplifyBlock(
    block?: Blockly.serialization.blocks.State
): Command[] {
    const commands: Command[] = [];
    while ((block = block?.next?.block)) {
        switch (block.type) {
            case "score": {
                const { level, column } = block.fields!;
                const { pieceName } = block.inputs!.target!.block!.fields!;
                commands.push({
                    type: "score",
                    level,
                    column,
                    gamePiece: pieceName,
                });
                break;
            }
            case "balance": {
                commands.push({
                    type: "balance",
                });
                break;
            }
            case "wait": {
                const { NUM } = block.inputs!.time!.block!.fields!;
                commands.push({
                    type: "wait",
                    time: NUM,
                });
                break;
            }
            case "intake": {
                const { index } = block.fields!;
                const { pieceName } = block.inputs!.target!.block!.fields!;
                commands.push({
                    type: "intake",
                    index,
                    gamePiece: pieceName,
                });
                break;
            }
        }
    }
    return commands;
}

const GRID_NUM = 1; // left, mid, and right grids - each grid is 3x3 but at outreach we usually only have 1 grid

export default function transpile(
    block?: Blockly.serialization.blocks.State
): string {
    console.debug(JSON.stringify(block));
    const commands = simplifyBlock(block);
    console.debug(JSON.stringify(commands));
    let statements: string[][] = [];

    for (const command of commands) {
        switch (command.type) {
            case "score": {
                const { level, column, gamePiece } = command;
                statements.push([
                    command.type,
                    gamePiece,
                    String(GRID_NUM),
                    level,
                    column,
                ]);
                break;
            }
            case "balance": {
                statements.push([command.type]);
                break;
            }
            case "wait": {
                const { time } = command;
                statements.push([command.type, String(time)]);
                break;
            }
            case "intake": {
                const { gamePiece, index } = command;
                statements.push([command.type, gamePiece, index]);
                break;
            }
        }
    }

    return statements.map((statement) => statement.join(" ")).join(";");
}
