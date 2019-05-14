namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _7 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DonHangs",
                c => new
                    {
                        DonHangId = c.Int(nullable: false, identity: true),
                        SoLuongBan = c.Int(nullable: false),
                        HinhThucTT = c.String(),
                        TongTien = c.Double(nullable: false),
                        NgayMua = c.DateTime(nullable: false),
                        KhachHangId = c.Int(nullable: false),
                        SanPhamId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DonHangId)
                .ForeignKey("dbo.KhachHangs", t => t.KhachHangId, cascadeDelete: true)
                .ForeignKey("dbo.SanPhams", t => t.SanPhamId, cascadeDelete: true)
                .Index(t => t.KhachHangId)
                .Index(t => t.SanPhamId);
            
            CreateTable(
                "dbo.KhachHangs",
                c => new
                    {
                        KhachHangId = c.Int(nullable: false, identity: true),
                        TenKH = c.String(nullable: false),
                        MoTa = c.String(nullable: false),
                        NgaySinh = c.DateTime(nullable: false),
                        SoDT = c.String(),
                    })
                .PrimaryKey(t => t.KhachHangId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DonHangs", "SanPhamId", "dbo.SanPhams");
            DropForeignKey("dbo.DonHangs", "KhachHangId", "dbo.KhachHangs");
            DropIndex("dbo.DonHangs", new[] { "SanPhamId" });
            DropIndex("dbo.DonHangs", new[] { "KhachHangId" });
            DropTable("dbo.KhachHangs");
            DropTable("dbo.DonHangs");
        }
    }
}
