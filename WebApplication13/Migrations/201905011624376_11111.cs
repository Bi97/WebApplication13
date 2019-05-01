namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _11111 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LoaiSPs", "TenLoai", c => c.String(nullable: false));
            DropColumn("dbo.LoaiSPs", "TenSP");
        }
        
        public override void Down()
        {
            AddColumn("dbo.LoaiSPs", "TenSP", c => c.String(nullable: false));
            DropColumn("dbo.LoaiSPs", "TenLoai");
        }
    }
}
