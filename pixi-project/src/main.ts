import {
  Application,
  Assets,
  Sprite,
  AnimatedSprite,
  AnimatedSpriteFrames,
  Renderer,
} from "pixi.js";

// 애니메이션 전환 함수 정의
function switchToAppearAnimation(
  animatedSprite: AnimatedSprite,
  apperTextures: AnimatedSpriteFrames,
  // eslint-disable-next-line prettier/prettier
  guardIdleTextures: AnimatedSpriteFrames
) {
  // 현재 애니메이션이 걷기 애니메이션이 아니라면
  animatedSprite.loop = false;

  animatedSprite.textures = apperTextures; // 텍스처 배열 변경
  animatedSprite.animationSpeed = 0.15; // 필요시 속도 재설정
  animatedSprite.play(); // 애니메이션 재생 (첫 프레임부터 시작)

  animatedSprite.onComplete = () => {
    animatedSprite.loop = true;

    animatedSprite.textures = guardIdleTextures; // 텍스처 배열 변경
    animatedSprite.animationSpeed = 0.15; // 필요시 속도 재설정
    animatedSprite.play(); // 애니메이션 재생 (첫 프레임부터 시작)
  };
}

/**
 * PixiJS 애플리케이션 크기를 브라우저 창 크기에 맞춰 조절하는 함수
 */
function resizeApp(app: Application<Renderer>, visitor) {
  if (!app) return; // app 인스턴스가 아직 초기화되지 않았으면 실행하지 않음

  // 새 너비와 높이 가져오기
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // 렌더러 크기 업데이트 (가장 중요!)
  app.renderer.resize(newWidth, newHeight);
  visitor.position.set(app.screen.width / 2, app.screen.height / 1.2);
  // (선택 사항) 스테이지나 UI 요소들의 위치/크기 재조정
  // app.screen은 현재 렌더링 화면의 논리적 크기를 나타냅니다.
  // mySprite.x = app.screen.width / 2;
  // mySprite.y = app.screen.height / 2;

  // 만약 앱을 캔버스 전체가 아니라 특정 비율을 유지하며 중앙에 배치하고 싶다면,
  // 좀 더 복잡한 스케일링 로직이 필요합니다. (아래 "고급 리사이즈 전략" 참고)

  console.log(`App resized to: ${app.screen.width}x${app.screen.height}`);
}

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    background: "black",
  });
  // await app.init({ background: "black" });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  Assets.addBundle("animationAssets", {
    idle1: "assets/idle1.jpeg",
    idle2: "assets/idle2.jpeg",
    idle3: "assets/idle3.jpeg",
    idle4: "assets/idle4.jpeg",
    idle5: "assets/idle5.jpeg",
    appear1: "assets/appear1.jpeg",
    appear2: "assets/appear2.jpeg",
    appear3: "assets/appear3.jpeg",
    appear4: "assets/appear4.jpeg",
    appear5: "assets/appear5.jpeg",
    appear6: "assets/appear6.jpeg",
    guard1: "assets/guard1.jpeg",
    guard2: "assets/guard2.jpeg",
    guard3: "assets/guard3.jpeg",
    guard4: "assets/guard4.jpeg",
    guard5: "assets/guard5.jpeg",
    guard6: "assets/guard6.jpeg",
    guard7: "assets/guard7.jpeg",
    guardIdle1: "assets/guard_idle1.jpeg",
    guardIdle2: "assets/guard_idle2.jpeg",
    guardIdle3: "assets/guard_idle3.jpeg",
    guardIdle4: "assets/guard_idle4.jpeg",
  });
  // 4. 애셋 로드
  // loadBundle은 비동기 함수이므로 await를 사용합니다.
  try {
    // const loadedAssets = await Assets.loadBundle("animationAssets");
    const loadedAssets = await Assets.loadBundle("animationAssets");

    // 5. 로드된 텍스처들을 사용하여 AnimatedSprite 생성
    const idleTextures = [
      loadedAssets.idle1,
      loadedAssets.idle2,
      loadedAssets.idle3,
      loadedAssets.idle4,
      loadedAssets.idle5,
    ];

    const apperTextures = [
      loadedAssets.appear1,
      loadedAssets.appear2,
      loadedAssets.appear3,
      loadedAssets.appear4,
      loadedAssets.appear5,
      loadedAssets.appear6,
    ];

    const guardTextures = [
      loadedAssets.guard1,
      loadedAssets.guard2,
      loadedAssets.guard3,
      loadedAssets.guard4,
      loadedAssets.guard5,
      loadedAssets.guard6,
      loadedAssets.guard7,
    ];

    const guardIdleTextures = [
      loadedAssets.guardIdle1,
      loadedAssets.guardIdle2,
      loadedAssets.guardIdle3,
      loadedAssets.guardIdle4,
    ];

    const animatedSprite = new AnimatedSprite(idleTextures);

    // 6. 애니메이션 속도 설정 (값을 조절하여 속도 변경 가능)
    animatedSprite.animationSpeed = 0.15; // 10프레임당 1프레임 진행 (느리게)
    // animatedSprite.animationSpeed = 0.2; // 더 빠르게
    // animatedSprite.animationSpeed = 0.5; // 매우 빠르게

    // 7. 애니메이션 루프 여부 설정
    animatedSprite.loop = true; // 애니메이션을 반복할지 여부 (기본값: true)

    // 8. 스프라이트 위치 설정 (캔버스 중앙에 배치)
    animatedSprite.anchor.set(0.5); // 스프라이트의 기준점을 중앙으로 설정
    animatedSprite.x = app.screen.width / 2;
    animatedSprite.y = app.screen.height / 2;

    // animatedSprite.width = 1240;
    // animatedSprite.height = 1080;

    // 9. 애니메이션 시작
    animatedSprite.play();

    // 10. 스프라이트를 스테이지에 추가하여 화면에 표시
    app.stage.addChild(animatedSprite);

    // setTimeout(() => {
    //   switchToAppearAnimation(animatedSprite, guardTextures, guardIdleTextures);
    // }, 3000);

    // // 예시: 6초 후 다시 걷기 애니메이션으로 전환
    // setTimeout(() => {
    //     switchToWalkAnimation();
    // }, 6000);

    console.log("PixiJS 애니메이션이 성공적으로 로드되고 재생됩니다.");
  } catch (error) {
    // 애셋 로딩 중 오류 발생 시 콘솔에 출력
    console.error("애셋 로딩 또는 애니메이션 생성 중 오류 발생:", error);
  }

  // // Load the bunny texture
  // const texture = await Assets.load("/assets/paper.png");
  // // Create a bunny Sprite
  // const paper = new Sprite(texture);
  // // Center the sprite's anchor point
  // paper.anchor.set(0.5);
  // // Move the sprite to the center of the screen
  // paper.position.set(app.screen.width / 2, app.screen.height / 2);
  // paper.width = 500;
  // paper.height = 500;
  // app.stage.addChild(paper);

  // Load the bunny texture
  const visitorTexture = await Assets.load("/assets/visitor.png");
  // Create a bunny Sprite
  const visitor = new Sprite(visitorTexture);
  // Center the sprite's anchor point
  visitor.anchor.set(0.5);
  // Move the sprite to the center of the screen
  visitor.position.set(app.screen.width / 2, app.screen.height / 1.2);
  app.stage.addChild(visitor);

  window.addEventListener("resize", () => resizeApp(app, visitor));

  // const targetX = app.screen.width / 2;
  // const targetY = app.screen.height / 1.2;
  // // Listen for animate update
  // app.ticker.add((time) => {
  //   const speed = 5;
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   // visitor.position.set(
  //   //   app.screen.width / 2,
  //   //   app.screen.height - time.deltaTime
  //   // );
  //   // delta는 프레임 시간 간격에 따른 보정 값 (프레임 드랍 시에도 일정한 속도 유지)
  //   // 예를 들어 60fps 기준 delta는 1이지만, 30fps에서는 2가 될 수 있음

  //   const dx = targetX - visitor.x;
  //   const dy = targetY - visitor.y;
  //   const distance = Math.sqrt(dx * dx + dy * dy); // 남은 거리 계산

  //   // 목표에 충분히 가까워지면 애니메이션 종료
  //   if (distance < speed * time.deltaTime) {
  //     // delta 보정 값을 곱해줘야 함
  //     visitor.x = targetX;
  //     visitor.y = targetY;
  //     console.log("스프라이트 목표 위치 도달!");
  //     return;
  //   }

  //   // 이동 방향 벡터 정규화
  //   const directionX = dx / distance;
  //   const directionY = dy / distance;

  //   // 스프라이트 위치 업데이트
  //   visitor.x += directionX * speed * time.deltaTime;
  //   visitor.y += directionY * speed * time.deltaTime;
  // });
})();
