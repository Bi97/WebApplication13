namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _6565 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SanPhams", "SoLuong", c => c.Single(nullable: false));
        }
    }
}
