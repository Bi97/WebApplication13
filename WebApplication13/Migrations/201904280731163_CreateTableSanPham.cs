namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTableSanPham : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LoaiSPs",
                c => new
                    {
                        LoaiSPId = c.Int(nullable: false, identity: true),
                        TenLoai = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.LoaiSPId);
            
            CreateTable(
                "dbo.SanPhams",
                c => new
                    {
                        SanPhamId = c.Int(nullable: false, identity: true),
                        TenSP = c.String(nullable: false),
                        SoLuong = c.Double(nullable: false),
                        MoTa = c.String(),
                        LoaiSPId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SanPhamId)
                .ForeignKey("dbo.LoaiSPs", t => t.LoaiSPId, cascadeDelete: true)
                .Index(t => t.LoaiSPId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SanPhams", "LoaiSPId", "dbo.LoaiSPs");
            DropIndex("dbo.SanPhams", new[] { "LoaiSPId" });
            DropTable("dbo.SanPhams");
            DropTable("dbo.LoaiSPs");
        }
    }
}
