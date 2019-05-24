namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _long : DbMigration
    {
        public override void Up()
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
                .PrimaryKey(t => t.ProductId)
                .ForeignKey("dbo.LoaiSPs", t => t.LoaiSPId, cascadeDelete: true)
                .Index(t => t.LoaiSPId);
            
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Int(nullable: false));
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Products", "LoaiSPId", "dbo.LoaiSPs");
            DropIndex("dbo.Products", new[] { "LoaiSPId" });
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Single(nullable: false));
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Single(nullable: false));
            DropTable("dbo.Products");
        }
    }
}
