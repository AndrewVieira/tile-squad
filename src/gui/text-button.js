class TextButton extends Phaser.GameObjects.Graphics {
  text;
  rect;

  constructor(scene, text, x, y, w, h) {
    super(scene);

    this.rect = new Phaser.Geom.Rectangle(x, y, w, h);
    this.text = scene.add
      .text(x, y, text, { fill: "#fff", align: "center" })
      .setDepth(1);

    this.text.x += (this.rect.width - this.text.displayWidth) / 2;
    this.text.y += (this.rect.height - this.text.displayHeight) / 2;

    this.setInteractive(this.rect, Phaser.Geom.Rectangle.Contains)
      .on("pointerover", () => {
        this.text.setStyle({ fill: "#ff0" });

        this.clear();
        this.lineStyle(2, 0xffffff, 1.0);
        this.strokeRectShape(this.rect);

        this.fillStyle(0x2222aa);
        this.fillRectShape(this.rect);
      })
      .on("pointerout", () => {
        this.text.setStyle({ fill: "#fff" });

        this.clear();
        this.lineStyle(2, 0xffffff, 0.0);
        this.strokeRectShape(this.rect);

        this.fillStyle(0x0000aa);
        this.fillRectShape(this.rect);
      });

    this.lineStyle(2, 0xffffff, 0.0);
    this.fillStyle(0x0000aa, 1.0);
    this.fillRectShape(this.rect);
    this.strokeRectShape(this.rect);

    scene.add.existing(this);
  }
}

export { TextButton };
