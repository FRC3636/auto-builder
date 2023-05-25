/*
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
*/

export default function blockToCommands(block: any): any {
    const commands = [];
    debugger;
    while ((block = block?.next?.block)) {
        switch (block.type) {
            case "score": {
                const { ROW, COL } = block.fields;
                const { GAME_PIECE } = block.inputs.NAME.block.fields;
                commands.push({
                    type: "score",
                    row: ROW,
                    col: COL,
                    gamePiece: GAME_PIECE,
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
                const { NUM } = block.inputs.NAME.block.fields;
                commands.push({
                    type: "wait",
                    time: NUM,
                });
                break;
            }
            case "intake": {
                const { ID } = block.fields;
                const { GAME_PIECE } = block.inputs.NAME.block.fields;
                commands.push({
                    type: "intake",
                    id: ID,
                    gamePiece: GAME_PIECE,
                });
                break;
            }
        }
    }
    return commands;
}
