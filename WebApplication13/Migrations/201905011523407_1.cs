namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LoaiSPs",
                c => new
                    {
                        LoaiSPId = c.Int(nullable: false, identity: true),
                        TenSP = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.LoaiSPId);
            
            CreateTable(
                "dbo.NhaCungCaps",
                c => new
                    {
                        NhaCungCapId = c.Int(nullable: false, identity: true),
                        TenNhaCungCap = c.String(nullable: false),
                        DiaChi = c.String(),
                    })
                .PrimaryKey(t => t.NhaCungCapId);
            
            CreateTable(
                "dbo.SanPhams",
                c => new
                    {
                        SanPhamId = c.Int(nullable: false, identity: true),
                        TenSP = c.String(nullable: false),
                        SoLuong = c.Double(nullable: false),
                        MoTa = c.String(),
                        NhaCungCapId = c.Int(nullable: false),
                        LoaiSPId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SanPhamId)
                .ForeignKey("dbo.LoaiSPs", t => t.LoaiSPId, cascadeDelete: true)
                .ForeignKey("dbo.NhaCungCaps", t => t.NhaCungCapId, cascadeDelete: true)
                .Index(t => t.NhaCungCapId)
                .Index(t => t.LoaiSPId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SanPhams", "NhaCungCapId", "dbo.NhaCungCaps");
            DropForeignKey("dbo.SanPhams", "LoaiSPId", "dbo.LoaiSPs");
            DropIndex("dbo.SanPhams", new[] { "LoaiSPId" });
            DropIndex("dbo.SanPhams", new[] { "NhaCungCapId" });
            DropTable("dbo.SanPhams");
            DropTable("dbo.NhaCungCaps");
            DropTable("dbo.LoaiSPs");
        }
    }
}
