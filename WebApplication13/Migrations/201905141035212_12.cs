namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _12 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.KhachHangs", "DiaChi", c => c.String(nullable: false));
            DropColumn("dbo.KhachHangs", "MoTa");
        }
        
        public override void Down()
        {
            AddColumn("dbo.KhachHangs", "MoTa", c => c.String(nullable: false));
            DropColumn("dbo.KhachHangs", "DiaChi");
        }
    }
}
