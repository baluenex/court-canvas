// ページの読み込みが完了したらコールバック関数が呼ばれる
// ※コールバック: 第2引数の無名関数(=関数名が省略された関数)
window.addEventListener('load', () => {
    const canvas = document.querySelector('#draw-area');
    // contextを使ってcanvasに絵を書いていく
    const context = canvas.getContext('2d');
  
    // 直前のマウスのcanvas上のx座標とy座標を記録する
    const lastPosition = { x: null, y: null };
  
    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ
    let isDrag = false;
  
    // 絵を書く
    function draw(x, y) {
      // マウスがドラッグされていなかったら処理を中断する。
      // ドラッグしながらしか絵を書くことが出来ない。
      if(!isDrag) {
        return;
      }
  
      // 「context.beginPath()」と「context.closePath()」を都度draw関数内で実行するよりも、
      // 線の描き始め(dragStart関数)と線の描き終わり(dragEnd)で1回ずつ読んだほうがより綺麗に線画書ける
  
      // 線の状態を定義する
      // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
      context.lineCap = 'round'; // 丸みを帯びた線にする
      context.lineJoin = 'round'; // 丸みを帯びた線にする
      context.lineWidth = 3; // 線の太さ
      context.strokeStyle = 'red'; // 線の色
  
      // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、
      // クリックしたところを開始点としている。
      // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
      // 現在のx, y座標を記録することで、次にマウスを動かした時に、
      // 前回の位置から現在のマウスの位置まで線を引くようになる。
      if (lastPosition.x === null || lastPosition.y === null) {
        // ドラッグ開始時の線の開始位置
        context.moveTo(x, y);
      } else {
        // ドラッグ中の線の開始位置
        context.moveTo(lastPosition.x, lastPosition.y);
      }
      // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
      // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
      // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
      //   前回の位置から現在の位置までの線(点のつながり)となる
      context.lineTo(x, y);
  
      // context.moveTo, context.lineToの値を元に実際に線を引く
      context.stroke();
  
      // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
      lastPosition.x = x;
      lastPosition.y = y;
    }
  
    // 書式設定とテニスコートを初期化する
    function clear() {
      // canvasを白紙に戻す
      context.clearRect(0, 0, canvas.width, canvas.height);

      // canvasサイズを初期化する
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      document.getElementById('draw-area').setAttribute('width', windowInnerWidth);
      document.getElementById('draw-area').setAttribute('height', windowInnerHeight);
      context.beginPath();

      // 書式を初期化する
      context.lineCap = "butt";
      context.lineJoin = "miter";
      context.lineWidth = 1;
      context.strokeStyle = "#000000";

      // コートを描写する
      const xStart = windowInnerWidth * 1/5;
      const yStart = windowInnerHeight * 1/4;
      // コート全体の枠
      context.strokeRect(xStart, yStart, windowInnerWidth*1/2, windowInnerHeight*1/2);
      // アレー
      context.strokeRect(xStart, yStart, windowInnerWidth*1/20, windowInnerHeight*1/2);
      context.strokeRect(xStart+windowInnerWidth*1/2, yStart, windowInnerWidth*1/20, windowInnerHeight*1/2);
      // サービスボックス
      context.strokeRect(xStart+windowInnerWidth*1/20, yStart+windowInnerHeight*1/8, windowInnerWidth*9/20, windowInnerHeight*1/4);
      context.strokeRect(xStart+windowInnerWidth*1/20, yStart+windowInnerHeight*1/8, windowInnerWidth*9/40, windowInnerHeight*1/4);
      // ネット
      context.moveTo(xStart-windowInnerWidth*1/20, yStart+windowInnerHeight*1/4);
      context.lineTo(xStart+windowInnerWidth*3/5, yStart+windowInnerHeight*1/4);
      context.stroke();
    }
  
    // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
    // お絵かき処理が途中で止まらないようにする
    function dragStart(event) {
      // これから新しい線を書き始めることを宣言する
      // 一連の線を書く処理が終了したらdragEnd関数内のclosePathで終了を宣言する
      context.beginPath();
  
      isDrag = true;
    }
    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
    // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    function dragEnd(event) {
      // 線を書く処理の終了を宣言する
      context.closePath();
      isDrag = false;
  
      // 描画中に記録していた値をリセットする
      lastPosition.x = null;
      lastPosition.y = null;
    }
  
    // マウス操作やボタンクリック時のイベント処理を定義する
    function initEventHandler() {
      const clearButton = document.querySelector('#clear-button');
      clearButton.addEventListener('click', (event) => {
        clear();
      });
  
      canvas.addEventListener('touchstart', dragStart);
      canvas.addEventListener('touchend', dragEnd);
      canvas.addEventListener('touchmove', (event) => {
        // 指を動かしている間は画面スクロールを禁止する
        event.preventDefault();
        const rect = event.target.getBoundingClientRect();
        let x = event.touches[0].clientX - rect.left;
        let y = event.touches[0].clientY - rect.top;

        draw(x, y);
      });
    }
  
    // イベント処理を初期化する
    initEventHandler();
  });