namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCTDH : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CTDonHangs",
                c => new
                    {
                        CTDonHangId = c.Int(nullable: false, identity: true),
                        SoLuong = c.Int(nullable: false),
                        DonGia = c.Int(nullable: false),
                        GiamGia = c.Single(nullable: false),
                        DonhangId = c.Int(nullable: false),
                        SanPhamId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CTDonHangId)
                .ForeignKey("dbo.DonHangs", t => t.DonhangId, cascadeDelete: true)
                .ForeignKey("dbo.SanPhams", t => t.SanPhamId, cascadeDelete: true)
                .Index(t => t.DonhangId)
                .Index(t => t.SanPhamId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CTDonHangs", "SanPhamId", "dbo.SanPhams");
            DropForeignKey("dbo.CTDonHangs", "DonhangId", "dbo.DonHangs");
            DropIndex("dbo.CTDonHangs", new[] { "SanPhamId" });
            DropIndex("dbo.CTDonHangs", new[] { "DonhangId" });
            DropTable("dbo.CTDonHangs");
        }
    }
}
