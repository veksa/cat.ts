import animejs from 'animejs';

const s = 500;
const r = s / 3e3;

let catNumber = 0;

let currentClientX: number;
let currentClientY: number;

const filters = [
    'brightness(130%) contrast(85%) hue-rotate(5deg) drop-shadow(0px 0px 1px rgba(218, 147, 30, 0.8))',
    'brightness(240%) contrast(65%) hue-rotate(335deg) saturate(140%) drop-shadow(0px 0px 1px rgba(255, 220, 163, 0.8))',
    'brightness(75%) contrast(95%) drop-shadow(0px 0px 1px rgba(120, 75, 2, 0.8))',
    'brightness(40%) grayscale(60%) saturate(0%) drop-shadow(0px 0px 2px rgba(130, 130, 130, 0.8))',
    'saturate(0%) drop-shadow(0px 0px 2px rgba(130, 130, 130, 0.8))',
    'brightness(260%) grayscale(60%) saturate(0%) drop-shadow(0px 0px 2px rgba(135, 135, 135, 0.6))',
];

const walkRight = 'walk_right';
const walkLeft = 'walk_left';
const sit1Right = 'sit1_right';
const sit1Left = 'sit1_left';
const sit2Right = 'sit2_right';
const sit2Left = 'sit2_left';
const sit3Right = 'sit3_right';
const sit3Left = 'sit3_left';
const jump1Right = 'jump1_right';
const jump1Left = 'jump1_left';
const jump2Right = 'jump2_right';
const jump2Left = 'jump2_left';
const jump3Right = 'jump3_right';
const jump3Left = 'jump3_left';
const jump4Right = 'jump4_right';
const jump4Left = 'jump4_left';
const jump5Right = 'jump5_right';
const jump5Left = 'jump5_left';
const jump6Right = 'jump6_right';
const jump6Left = 'jump6_left';
const jump7Right = 'jump7_right';
const jump7Left = 'jump7_left';
const stay1Right = 'stay1_right';
const stay1Left = 'stay1_left';
const stay2Right = 'stay2_right';
const stay2Left = 'stay2_left';

enum WalkSpeed {
    Slow = '1x',
    Medium = '1-2x',
    Fast = '1-5x'
}

enum WalkType {
    w1 = 'w1',
    w2 = 'w2'
}

const getWalkSpeedInNumber = (walkSpeed: WalkSpeed) => {
    switch (walkSpeed) {
        case WalkSpeed.Slow:
            return 1;
        case WalkSpeed.Medium:
            return 1.2;
        case WalkSpeed.Fast:
            return 1.5;
        default:
            return undefined;
    }
};

const getTurnObject = ({catNumber, direction, walkType, zPositionWidthRate, actionType}) => ({
    time: timing.TURN[walkType],
    imgSource: getTurnImage({catNumber, walkType}),
    startPosition: ('right' === direction
        ? position.START.w1
        : s - position.START.w1) * zPositionWidthRate,
    endPostion: ('right' === direction
        ? position.END.TURN
        : s - position.END.TURN) * zPositionWidthRate,
    isTranspose: 'left' === direction,
    actionType,
});

const getWalkObject = ({catNumber, direction, walkType, walkSpeed, zPositionWidthRate, actionType}) => ({
    time: timing.WALK[walkType] / getWalkSpeedInNumber(walkSpeed),
    distance: deltaDistance[walkType] * timing.WALK[walkType],
    imgSource: getWalkImage({catNumber, walkType, walkSpeed}),
    startPosition: ('right' === direction
        ? position.START.w1
        : s - position.START.w1) * zPositionWidthRate,
    endPostion: ('right' === direction
        ? position.END.WALK
        : s - position.END.WALK) * zPositionWidthRate,
    isTranspose: 'left' === direction,
    actionType,
});

const getSitObject = ({catNumber, pattern, direction, zPositionWidthRate, actionType, sitDuration}) => ({
    time: timing.SIT[pattern][sitDuration].w1,
    imgSource: getSitImage({catNumber, sitPattern: pattern, sitDuration, walkType: WalkType.w1}),
    startPosition: ('right' === direction
        ? position.START.w1
        : s - position.START.w1) * zPositionWidthRate,
    endPostion: ('right' === direction
        ? position.END.SIT[pattern]
        : s - position.END.SIT[pattern]) * zPositionWidthRate,
    isTranspose: 'left' === direction,
    actionType,
});

const getStayObject = ({catNumber, pattern, direction, walkType, zPositionWidthRate, actionType}) => ({
    time: timing.STAY[pattern][walkType],
    imgSource: getStayImage({catNumber, stayPattern: pattern, walkType}),
    startPosition: ('right' === direction
        ? position.START.w1
        : s - position.START.w1) * zPositionWidthRate,
    endPostion: ('right' === direction
        ? position.END.STAY[pattern]
        : s - position.END.STAY[pattern]) * zPositionWidthRate,
    isTranspose: 'left' === direction,
    actionType,
});

const getJumpObject = ({catNumber, pattern, direction, zPositionWidthRate, actionType}) => ({
    time: timing.JUMP[pattern],
    imgSource: getJumpImage({catNumber, jumpPattern: pattern}),
    startPosition: ('right' === direction
        ? position.START.w1
        : s - position.START.w1) * zPositionWidthRate,
    endPostion: ('right' === direction
        ? position.END.JUMP[pattern]
        : s - position.END.JUMP[pattern]) * zPositionWidthRate,
    isTranspose: 'left' === direction,
    actionType,
});

const timing = {
    WALK: {w1: 1120, w2: 940},
    TURN: {w1: 2120, w2: 2660},
    SIT: {
        1: {X0: {w1: 9700}, X1: {w1: 21300}, X2: {w1: 32900}},
        2: {X0: {w1: 12720}, X1: {w1: 19580}, X2: {w1: 26440}},
        3: {X0: {w1: 7540}, X1: {w1: 12140}, X2: {w1: 16740}},
    },
    STAY: {1: {w1: 3160, w2: 3700}, 2: {w1: 2e3, w2: 2540}},
    JUMP: {1: 1140, 2: 1220, 3: 1540, 4: 1440, 5: 1820, 6: 1900, 7: 1700},
};

const position = {
    START: {w1: 1763 * r, w2: 1720 * r},
    END: {
        WALK: 1763 * r,
        TURN: 1292 * r,
        SIT: {1: 742 * r, 2: 308.5, 3: 2461 * r},
        STAY: {1: 2689 * r, 2: 499.5},
        JUMP: {1: 772 * r, 2: 1934 * r, 3: 862 * r, 4: 253, 5: 1952 * r, 6: 397.5, 7: 277.5},
    },
};

const getWalkImage = ({catNumber, walkType, walkSpeed}) => {
    return require(`./resources/${catNumber}/0_GIF_walk_${walkType}_${walkSpeed}.gif`);
};

const getTurnImage = ({catNumber, walkType}) => {
    return require(`./resources/${catNumber}/0_GIF_turn_${walkType}.gif`);
};

const getSitImage = ({catNumber, sitPattern, sitDuration, walkType}) => {
    return require(`./resources/${catNumber}/0_GIF_sit${sitPattern}_${sitDuration}_${walkType}.gif`);
};

const getJumpImage = ({catNumber, jumpPattern}) => {
    return require(`./resources/${catNumber}/0_GIF_jump${jumpPattern}.gif`);
};

const getStayImage = ({catNumber, stayPattern, walkType}) => {
    return require(`./resources/${catNumber}/0_GIF_stay${stayPattern}_${walkType}.gif`);
};

const deltaDistance = {w1: .05, w2: .07};

const makeTimeout = (time: number) => {
    return new Promise((callback => setTimeout(callback, time)));
};

const applyTranslate = ({catDOM, beforePositionX, nextPositionX, initialPosition}) => {
    const n = catDOM.getBoundingClientRect().left;
    catDOM.style.transform = `translateX(${n - initialPosition + (beforePositionX - nextPositionX)}px)`;
};

const applyScale = ({catImgDOM, isTranspose}) => {
    catImgDOM.style.transform = isTranspose
        ? 'scaleX(-1)'
        : 'scaleX(1)';
};

const setImage = ({catImgDOM, source}) => {
    catImgDOM.setAttribute('src', source);
};

const inBound = (value, min, max) => {
    return value >= min && value <= max;
};

const willTheCatJump = async ({catDOM, catImgDOM, walkActionObject, initialPosition}) => {
    var distance;
    var r;
    var c;

    let l;

    const u = catDOM.getBoundingClientRect().left;

    if (catDOM.getBoundingClientRect().top, u < -250 && walkActionObject.isTranspose || u > document.body.clientWidth - s && !walkActionObject.isTranspose) {
        l = 1;
    } else {
        const t = walkActionObject.isTranspose
            ? u + 250
            : document.body.clientWidth - u - 250;

        const e = Math.floor(t / (null !== (distance = walkActionObject.distance) && void 0 !== distance
            ? distance
            : 0));

        l = Math.ceil(e * Math.random());
    }

    const translateX = u - initialPosition + (walkActionObject.isTranspose
        ? -(null !== (c = walkActionObject.distance) && void 0 !== c
            ? c
            : 0)
        : null !== (r = walkActionObject.distance) && void 0 !== r
            ? r
            : 0) * l;
    const duration = walkActionObject.time * l;

    setImage({
        catImgDOM,
        source: walkActionObject.imgSource,
    });

    applyScale({catImgDOM, isTranspose: walkActionObject.isTranspose});

    let willJump = false;

    const promise = new Promise(resolve => {
        const anime = animejs({
            targets: catDOM,
            translateX: `${translateX}px`,
            duration,
            easing: 'linear',
            change: () => {
                const left = catDOM.getBoundingClientRect().left;
                const top = catDOM.getBoundingClientRect().top;

                if (currentClientY > top + 200 && currentClientY < top + s - 150 && currentClientX > left + 200 && currentClientX < left + s - 200) {
                    willJump = true;

                    anime.pause();
                    resolve(true);
                }
            },
        });

        return anime.finished.then(resolve);
    });

    await promise;

    return {
        willJump,
    };
};

const updateCatTurn = async ({catImgDOM, turnActionObject}) => {
    applyScale({catImgDOM, isTranspose: turnActionObject.isTranspose});

    setImage({
        catImgDOM,
        source: turnActionObject.imgSource,
    });

    await makeTimeout(turnActionObject.time);
};

const updateCatJump = async ({catImgDOM, jumpActionObject}) => {
    applyScale({catImgDOM, isTranspose: jumpActionObject.isTranspose});

    setImage({
        catImgDOM,
        source: jumpActionObject.imgSource,
    });

    await makeTimeout(jumpActionObject.time);
};

const updateCatSit = async ({catImgDOM, sitActionObject}) => {
    applyScale({catImgDOM, isTranspose: sitActionObject.isTranspose});

    setImage({
        catImgDOM,
        source: sitActionObject.imgSource,
    });

    await makeTimeout(sitActionObject.time);
};

const updateCatStay = async ({catImgDOM, stayActionObject}) => {
    applyScale({catImgDOM, isTranspose: stayActionObject.isTranspose});

    setImage({
        catImgDOM,
        source: stayActionObject.imgSource,
    });

    await makeTimeout(stayActionObject.time);
};

const getSitDuration = () => {
    const random = Math.random();

    if (inBound(random, 0, .33)) {
        return 'X0';
    } else if (inBound(random, .33, .66)) {
        return 'X1';
    } else {
        return 'X2';
    }
};

const startCat = async (cat) => {
    const {
        catNumber,
        initialPosition,
        zPositionWidthRate,
        walkType,
        walkSpeed,
        catDOM,
        catImgDOM,
    } = cat;

    let moveType = walkRight;

    let movableObject = {
        imgSource: '',
        startPosition: position.START.w1 * zPositionWidthRate,
        endPostion: position.END.TURN * zPositionWidthRate,
        time: 0,
        isTranspose: !1,
        actionType: walkRight,
    };

    for (; ;) {
        const t = Math.random();

        switch (movableObject.actionType) {
            case walkRight:
                if (inBound(t, 0, .12)) {
                    moveType = sit1Right;
                } else if (inBound(t, .12, .24)) {
                    moveType = sit2Right;
                } else if (inBound(t, .24, .36)) {
                    moveType = sit3Right;
                } else if (inBound(t, .36, .48)) {
                    moveType = stay1Right;
                } else if (inBound(t, .48, .6)) {
                    moveType = stay2Right;
                } else if (inBound(t, .6, .8)) {
                    moveType = walkRight;
                } else if (inBound(t, .8, 1)) {
                    moveType = walkLeft;
                }
                break;
            case sit1Right:
            case sit2Right:
                moveType = walkLeft;
                break;
            case sit3Right:
            case stay1Right:
            case stay2Right:
                moveType = walkRight;
                break;
            case jump1Right:
            case jump2Right:
            case jump3Right:
            case jump4Right:
                moveType = walkLeft;
                break;
            case jump5Right:
            case jump6Right:
            case jump7Right:
                moveType = walkRight;
                break;
            case walkLeft:
                if (inBound(t, 0, .12)) {
                    moveType = sit1Left;
                } else if (inBound(t, .12, .24)) {
                    moveType = sit2Left;
                } else if (inBound(t, .24, .36)) {
                    moveType = sit3Left;
                } else if (inBound(t, .36, .48)) {
                    moveType = stay1Left;
                } else if (inBound(t, .48, .6)) {
                    moveType = stay2Left;
                } else if (inBound(t, .6, .8)) {
                    moveType = walkLeft;
                } else if (inBound(t, .8, 1)) {
                    moveType = walkRight;
                }
                break;
            case sit1Left:
            case sit2Left:
                moveType = walkRight;
                break;
            case sit3Left:
            case stay1Left:
            case stay2Left:
                moveType = walkLeft;
                break;
            case jump1Left:
            case jump2Left:
            case jump3Left:
            case jump4Left:
                moveType = walkRight;
                break;
            case jump5Left:
            case jump6Left:
            case jump7Left:
                moveType = walkLeft;
        }

        switch (moveType) {
            case walkRight: {
                if (movableObject.actionType === walkLeft) {
                    const turnActionObject = getTurnObject({
                        catNumber,
                        direction: 'left',
                        walkType,
                        zPositionWidthRate,
                        actionType: 'turn_left',
                    });

                    applyTranslate({
                        catDOM,
                        beforePositionX: movableObject.endPostion,
                        nextPositionX: turnActionObject.startPosition,
                        initialPosition: initialPosition,
                    });

                    await updateCatTurn({catImgDOM, turnActionObject});

                    movableObject = turnActionObject;
                }
                const walkActionObject = getWalkObject({
                    catNumber: catNumber,
                    direction: 'right',
                    walkType,
                    walkSpeed,
                    zPositionWidthRate,
                    actionType: walkRight,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: walkActionObject.startPosition,
                    initialPosition,
                });

                const nextJump = await willTheCatJump({
                    catDOM,
                    catImgDOM,
                    walkActionObject,
                    initialPosition,
                });

                if (nextJump.willJump) {
                    let actionType;
                    let pattern;

                    if (inBound(t, 0, .25)) {
                        pattern = 1;
                        actionType = jump1Right;
                    } else if (inBound(t, .25, .375)) {
                        pattern = 2;
                        actionType = jump2Right;
                    } else if (inBound(t, .375, .5)) {
                        pattern = 3;
                        actionType = jump3Right;
                    } else if (inBound(t, .5, .625)) {
                        pattern = 4;
                        actionType = jump4Right;
                    } else if (inBound(t, .625, .75)) {
                        pattern = 5;
                        actionType = jump5Right;
                    } else if (inBound(t, .75, .875)) {
                        pattern = 6;
                        actionType = jump6Right;
                    } else {
                        pattern = 7;
                        actionType = jump7Right;
                    }

                    const jumpObject = getJumpObject({
                        catNumber,
                        pattern,
                        direction: 'right',
                        zPositionWidthRate,
                        actionType,
                    });

                    await updateCatJump({catImgDOM, jumpActionObject: jumpObject});

                    movableObject = jumpObject;
                } else {
                    movableObject = walkActionObject;
                }

                break;
            }
            case walkLeft: {
                if (movableObject.actionType === walkRight) {
                    const turnObject = getTurnObject({
                        catNumber,
                        direction: 'right',
                        walkType,
                        zPositionWidthRate,
                        actionType: 'turn_right',
                    });

                    applyTranslate({
                        catDOM,
                        beforePositionX: movableObject.endPostion,
                        nextPositionX: turnObject.startPosition,
                        initialPosition: initialPosition,
                    });

                    await updateCatTurn({catImgDOM, turnActionObject: turnObject});

                    movableObject = turnObject;
                }

                const walkObject = getWalkObject({
                    catNumber,
                    direction: 'left',
                    walkType,
                    walkSpeed,
                    zPositionWidthRate,
                    actionType: walkLeft,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: walkObject.startPosition,
                    initialPosition,
                });

                const nextJump = await willTheCatJump({
                    catDOM,
                    catImgDOM,
                    walkActionObject: walkObject,
                    initialPosition,
                });

                if (nextJump.willJump) {
                    let actionType;
                    let pattern;

                    if (inBound(t, 0, .25)) {
                        pattern = 1;
                        actionType = jump1Left;
                    } else if (inBound(t, .25, .375)) {
                        pattern = 2;
                        actionType = jump3Left;
                    } else if (inBound(t, .375, .5)) {
                        pattern = 3;
                        actionType = jump3Left;
                    } else if (inBound(t, .5, .625)) {
                        pattern = 4;
                        actionType = jump4Left;
                    } else if (inBound(t, .625, .75)) {
                        pattern = 5;
                        actionType = jump5Left;
                    } else if (inBound(t, .75, .875)) {
                        pattern = 6;
                        actionType = jump6Left;
                    } else {
                        pattern = 7;
                        actionType = jump7Left;
                    }

                    const jumpObject = getJumpObject({
                        catNumber,
                        pattern,
                        direction: 'left',
                        zPositionWidthRate,
                        actionType,
                    });

                    await updateCatJump({catImgDOM, jumpActionObject: jumpObject});

                    movableObject = jumpObject;
                } else {
                    movableObject = walkObject;
                }
                break;
            }
            case sit1Right: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber,
                    pattern: 1,
                    direction: 'right',
                    zPositionWidthRate,
                    actionType: sit1Right,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case sit1Left: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber,
                    pattern: 1,
                    direction: 'left',
                    zPositionWidthRate,
                    actionType: sit1Left,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM: catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case sit2Right: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber: catNumber,
                    pattern: 2,
                    direction: 'right',
                    zPositionWidthRate,
                    actionType: sit2Right,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM: catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case sit2Left: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber: catNumber,
                    pattern: 2,
                    direction: 'left',
                    zPositionWidthRate,
                    actionType: sit2Left,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM: catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case sit3Right: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber: catNumber,
                    pattern: 3,
                    direction: 'right',
                    zPositionWidthRate,
                    actionType: sit3Right,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM: catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case sit3Left: {
                const sitDuration = getSitDuration();

                const nextObject = getSitObject({
                    catNumber,
                    pattern: 3,
                    direction: 'left',
                    zPositionWidthRate,
                    actionType: sit3Left,
                    sitDuration,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatSit({catImgDOM: catImgDOM, sitActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case stay1Right: {
                const nextObject = getStayObject({
                    catNumber,
                    pattern: 1,
                    direction: 'right',
                    walkType,
                    zPositionWidthRate,
                    actionType: stay1Right,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatStay({catImgDOM, stayActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case stay1Left: {
                const nextObject = getStayObject({
                    catNumber: catNumber,
                    pattern: 1,
                    direction: 'left',
                    walkType,
                    zPositionWidthRate: zPositionWidthRate,
                    actionType: stay1Left,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatStay({catImgDOM, stayActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case stay2Right: {
                const nextObject = getStayObject({
                    catNumber,
                    pattern: 2,
                    direction: 'right',
                    walkType,
                    zPositionWidthRate,
                    actionType: stay2Right,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatStay({catImgDOM, stayActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
            case stay2Left: {
                const nextObject = getStayObject({
                    catNumber,
                    pattern: 2,
                    direction: 'left',
                    walkType,
                    zPositionWidthRate,
                    actionType: stay2Left,
                });

                applyTranslate({
                    catDOM,
                    beforePositionX: movableObject.endPostion,
                    nextPositionX: nextObject.startPosition,
                    initialPosition,
                });

                await updateCatStay({catImgDOM, stayActionObject: nextObject});

                movableObject = nextObject;

                break;
            }
        }
    }
};

const makeCat = () => {
    let initialPosition = 0;

    if (catNumber > 1) {
        initialPosition = Math.random() < .5
            ? -500
            : document.body.clientWidth + s;
    }

    let e: number;

    const i = Math.random();

    if (inBound(i, 0, .33)) {
        e = 1;
    } else if (inBound(i, .33, .66)) {
        e = 2;
    } else {
        e = 3;
    }

    let walkType: WalkType;
    let walkSpeed: WalkSpeed;

    const a = Math.random();

    if (inBound(a, 0, .33)) {
        walkType = WalkType.w1;
        walkSpeed = WalkSpeed.Slow;
    } else if (inBound(a, .33, .66)) {
        walkType = WalkType.w1;
        walkSpeed = WalkSpeed.Medium;
    } else {
        walkType = WalkType.w1;
        walkSpeed = WalkSpeed.Fast;
    }

    const catDOM = document.createElement('div');
    const catImgDOM = document.createElement('img');

    let zPositionWidthRate: number;

    switch (e) {
        case 1:
            catDOM.style.zIndex = '10001';
            zPositionWidthRate = .95;
            catDOM.style.bottom = '25px';
            break;
        case 2:
            catDOM.style.zIndex = '10002';
            zPositionWidthRate = 1;
            catDOM.style.bottom = '0px';
            break;
        case 3:
            catDOM.style.zIndex = '10003';
            zPositionWidthRate = 1.05;
            catDOM.style.bottom = '-25px';
            break;
        default:
            zPositionWidthRate = 1;
    }

    catDOM.style.position = 'fixed';
    catDOM.style.outline = '0';
    catDOM.style.pointerEvents = 'none';
    catDOM.style.left = `${initialPosition}px`;
    catDOM.style.width = s * zPositionWidthRate + 'px';
    catDOM.style.height = s * zPositionWidthRate + 'px';
    catDOM.id = 'cat' + catNumber.toString();

    catImgDOM.style.width = s * zPositionWidthRate + 'px';
    catImgDOM.style.height = s * zPositionWidthRate + 'px';
    catImgDOM.style.filter = filters[Math.floor(Math.random() * filters.length)];
    catImgDOM.id = 'cat-img-' + Math.floor(1e3 * Math.random());

    catDOM.appendChild(catImgDOM);

    document.getElementsByTagName('body')[0].appendChild(catDOM);

    const destroy = () => {
        catDOM.remove();
    }

    return {
        catDOM,
        catImgDOM,
        initialPosition,
        zPositionWidthRate,
        walkType,
        walkSpeed,
        catNumber,
        destroy,
    };
};

export const createCat = () => {
    const onMouseMove = (event) => {
        currentClientX = event.clientX;
        currentClientY = event.clientY;
    };

    document.body.addEventListener('mousemove', onMouseMove);

    catNumber++;
    const cat = makeCat();
    void startCat(cat);

    return () => {
        document.body.removeEventListener('mousemove', onMouseMove);

        cat.destroy();
    };
};
