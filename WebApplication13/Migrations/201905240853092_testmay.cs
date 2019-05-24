namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class testmay : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Products", "LoaiSPId", "dbo.LoaiSPs");
            DropIndex("dbo.Products", new[] { "LoaiSPId" });
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Double(nullable: false));
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Double(nullable: false));
            DropTable("dbo.Products");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        ProductId = c.Int(nullable: false, identity: true),
                        TenSP = c.String(nullable: false),
                        SoLuong = c.Single(nullable: false),
                        MoTa = c.String(),
                        DonGia = c.Single(nullable: false),
                        LoaiSPId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ProductId);
            
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Int(nullable: false));
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Int(nullable: false));
            CreateIndex("dbo.Products", "LoaiSPId");
            AddForeignKey("dbo.Products", "LoaiSPId", "dbo.LoaiSPs", "LoaiSPId", cascadeDelete: true);
        }
    }
}
