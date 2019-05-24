namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class update : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Single(nullable: false));
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Double(nullable: false));
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Double(nullable: false));
        }
    }
}
