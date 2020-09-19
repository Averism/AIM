


let AIM = (function () {
    let ident = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    let tl = (x, y) => [1, 0, x, 0, 1, y, 0, 0, 1];
    let rt = a => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
    let sc = (x, y) => [x, 0, 0, 0, y, 0, 0, 0, 1];
    let sh = (x, y) => [1, x, 0, y, 1, 0, 0, 0, 1];
    let mm = (a, b) => [
        a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
        a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
        a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
    ];
    let mmm = a => a.reverse().reduce((p, c) => mm(p, c), ident);
    let tf = (x, y, m) => [x * m[0] + y * m[1] + m[2], x * m[3] + y * m[4] + m[5]];
    let ttf = (t, m) => [tf(...t[0], m), tf(...t[1], m), tf(...t[2], m)];
    let fd = (t) => -Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
    let mtt = m => [m[0], m[3], m[1], m[4], m[2], m[5]];
    let offset = function (p1, p2) {
        let dx = p2[0] - p1[0];
        let dy = p2[1] - p1[1];
        let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let dx2 = dx * 0.7 / length;
        let dy2 = dy * 0.7 / length;
        return [p1[0] - dx2, p1[1] - dy2];
    };

    return {
        mapTriangle:
            function (source, triangleSource, target, triangleTarget) {
                let left = Math.min(triangleSource[0][0], triangleSource[1][0], triangleSource[2][0]);
                let right = Math.max(triangleSource[0][0], triangleSource[1][0], triangleSource[2][0]);
                let top = Math.min(triangleSource[0][1], triangleSource[1][1], triangleSource[2][1]);
                let bottom = Math.max(triangleSource[0][1], triangleSource[1][1], triangleSource[2][1]);
                let width = right - left;
                let height = bottom - top;
                let m1 = mmm([tl(-triangleSource[0][0], -triangleSource[0][1]), rt(fd(triangleSource))]);
                let t1 = ttf(triangleSource, m1);
                let t2 = ttf(triangleTarget, mmm([tl(-triangleTarget[0][0], -triangleTarget[0][1]), rt(fd(triangleTarget))]));
                let sx = t2[1][0] / t1[1][0];
                let sy = t2[2][1] / t1[2][1];
                m1 = mmm([m1, sc(sx, sy)]);
                let state2 = ttf(triangleSource, m1);
                let shx = (t2[2][0] - t1[2][0] * sx) / (t1[2][1] * sy);
                m1 = mmm([m1, sh(shx, 0)]);
                let state3 = ttf(triangleSource, m1);
                m1 = mmm([m1, rt(-fd(triangleTarget)), tl(...triangleTarget[0])]);
                let transform = mtt(m1);
                
                target.save();
                target.setTransform(...transform);
                target.beginPath();
                target.moveTo(...offset(triangleSource[0], triangleSource[1]));
                target.lineTo(...offset(triangleSource[0], triangleSource[2]));
                target.lineTo(...offset(triangleSource[1], triangleSource[2]));
                target.lineTo(...offset(triangleSource[1], triangleSource[0]));
                target.lineTo(...offset(triangleSource[2], triangleSource[0]));
                target.lineTo(...offset(triangleSource[2], triangleSource[1]));
                target.closePath();
                target.clip();
                target.drawImage(source, left, top, width, height, left, top, width, height);
                target.restore();
            }
    }
})();