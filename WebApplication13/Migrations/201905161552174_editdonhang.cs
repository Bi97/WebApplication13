namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class editdonhang : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.DonHangs", "SanPhamId", "dbo.SanPhams");
            DropIndex("dbo.DonHangs", new[] { "SanPhamId" });
            DropColumn("dbo.DonHangs", "SanPhamId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.DonHangs", "SanPhamId", c => c.Int(nullable: false));
            CreateIndex("dbo.DonHangs", "SanPhamId");
            AddForeignKey("dbo.DonHangs", "SanPhamId", "dbo.SanPhams", "SanPhamId", cascadeDelete: true);
        }
    }
}
